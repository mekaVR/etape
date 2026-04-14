#!/usr/bin/env node

/**
 * Fix shadcn-generated code for monorepo compatibility.
 *
 * 1. Imports: `@/...` → `@workspace/ui/...`
 *    shadcn uses the tsconfig path alias `@/` which only works inside the package.
 *    Vite in consuming apps can't resolve it — we rewrite to the package export.
 *
 * 2. Slot.Root types: split `const Comp = asChild ? Slot.Root : "element"`
 *    into explicit if/else branches to avoid React 19 TS2322 union type mismatch.
 *
 * Usage:  node scripts/fix-slot-types.mjs
 * Auto:   npm run ui:add -- sidebar
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const srcDir = join(__dirname, "..", "src")
const componentsDir = join(srcDir, "components")
const hooksDir = join(srcDir, "hooks")

// --- Phase 1: Rewrite @/ imports to @workspace/ui/ ---
const IMPORT_RE = /from "(@)\//g

let importFixes = 0
for (const dir of [componentsDir, hooksDir]) {
  if (!existsSync(dir)) continue
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue
    const filePath = join(dir, file)
    const content = readFileSync(filePath, "utf-8")
    if (!content.includes('"@/')) continue
    const fixed = content.replace(/from "@\//g, 'from "@workspace/ui/')
    if (fixed !== content) {
      writeFileSync(filePath, fixed)
      const count = (content.match(/from "@\//g) || []).length
      console.log(`  ✓ ${file} — ${count} import${count > 1 ? "s" : ""} rewritten`)
      importFixes += count
    }
  }
}

if (importFixes === 0) {
  console.log("  ✔ No @/ imports to rewrite.")
} else {
  console.log(`  Rewrote ${importFixes} import${importFixes > 1 ? "s" : ""}.\n`)
}

// --- Phase 2: Fix Slot.Root type union ---
const COMP_RE =
  /^(?<indent>\s*)const (?<varName>\w+) = asChild \? Slot\.Root : "(?<element>\w+)"/

let totalFixes = 0

for (const file of readdirSync(componentsDir)) {
  if (!file.endsWith(".tsx")) continue

  const filePath = join(componentsDir, file)
  const lines = readFileSync(filePath, "utf-8").split("\n")
  let fileFixes = 0

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(COMP_RE)
    if (!match) continue

    const { indent, varName, element } = match.groups

    // --- Collect intermediate lines between `const Comp` and the JSX block ---
    let j = i + 1
    const intermediateLines = []
    while (j < lines.length && !lines[j].includes(`<${varName}`)) {
      intermediateLines.push(lines[j])
      j++
    }

    // --- Detect wrapper: `return (` or `const xxx = (` ---
    let wrapperIdx = j - 1
    while (wrapperIdx > i && lines[wrapperIdx].trim() === "") wrapperIdx--
    const wrapperLine = lines[wrapperIdx].trim()
    const isReturn = wrapperLine === "return ("
    const constAssign = wrapperLine.match(/^const (\w+) = \($/)

    // --- Extract JSX block: from `<Comp` to `/>` ---
    const jsxStart = j
    let jsxEnd = j
    while (jsxEnd < lines.length && !lines[jsxEnd].trimEnd().endsWith("/>")) {
      jsxEnd++
    }

    // --- Find closing `)` after `/>` ---
    let closingParen = jsxEnd + 1
    if (closingParen < lines.length && lines[closingParen].trim() === ")") {
      // include the closing paren in the replacement range
    } else {
      closingParen = jsxEnd + 1
    }

    // --- Extract JSX lines and build the two branches ---
    const jsxLines = lines.slice(jsxStart, jsxEnd + 1)

    // Detect which variable holds the spread: `{...props}` or `{...rest}` etc.
    const propsMatch = jsxLines.join("\n").match(/\{\.\.\.(\w+)\}/)
    if (!propsMatch) continue
    const propsVar = propsMatch[1]

    const slotJsx = jsxLines.map((l) =>
      l
        .replace(`<${varName}`, "<Slot.Root")
        .replace(
          `{...${propsVar}}`,
          `{...(${propsVar} as React.ComponentProps<typeof Slot.Root>)}`
        )
    )
    const nativeJsx = jsxLines.map((l) =>
      l.replace(`<${varName}`, `<${element}`)
    )

    // --- Build replacement block ---
    let replacement = []

    if (isReturn) {
      // Remove the intermediate lines that belong before the JSX
      // (they stay before the if/else)
      const interBefore = intermediateLines.filter(
        (l) => l.trim() !== "" && l.trim() !== "return ("
      )
      replacement.push(
        ...interBefore,
        `${indent}if (asChild) {`,
        `${indent}  return (`,
        ...slotJsx.map((l) => `${indent}  ${l.trim() === "" ? "" : "  " + l.trimStart()}`),
        `${indent}  )`,
        `${indent}}`,
        ``,
        `${indent}return (`,
        ...nativeJsx,
        `${indent})`
      )
    } else if (constAssign) {
      const assignVar = constAssign[1]
      const interBefore = intermediateLines.filter(
        (l) => l.trim() !== "" && !l.trim().startsWith(`const ${assignVar}`)
      )
      replacement.push(
        ...interBefore,
        `${indent}const ${assignVar} = asChild ? (`,
        ...slotJsx.map((l) => `${indent}  ${l.trimStart()}`),
        `${indent}) : (`,
        ...nativeJsx.map((l) => `${indent}  ${l.trimStart()}`),
        `${indent})`
      )
    } else {
      // Fallback: just annotate the type (simplest fix)
      lines[i] = lines[i].replace(
        `const ${varName} =`,
        `const ${varName}: React.ElementType =`
      )
      fileFixes++
      continue
    }

    // --- Replace lines in the source ---
    // Range to replace: from line i (const Comp) to closingParen-1
    const replaceEnd =
      lines[closingParen]?.trim() === ")" ? closingParen + 1 : jsxEnd + 1
    lines.splice(i, replaceEnd - i, ...replacement)
    fileFixes++

    // Adjust index to skip past what we just inserted
    i += replacement.length - 1
  }

  if (fileFixes > 0) {
    writeFileSync(filePath, lines.join("\n"))
    console.log(`  ✓ ${file} — ${fileFixes} fix${fileFixes > 1 ? "es" : ""}`)
    totalFixes += fileFixes
  }
}

if (totalFixes === 0) {
  console.log("  ✔ No broken Slot.Root pattern found.")
} else {
  console.log(`\n  Fixed ${totalFixes} pattern${totalFixes > 1 ? "s" : ""}.`)
}
