#!/usr/bin/env node

/**
 * Wrapper around `npx shadcn@latest add` that automatically fixes
 * Slot.Root type errors and formats the output.
 *
 * Usage: node scripts/ui-add.mjs <component> [component...]
 * Via npm: npm run ui:add -- <component> [component...]
 */

import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgDir = join(__dirname, "..")

const components = process.argv.slice(2)

if (components.length === 0) {
  console.error("Usage: npm run ui:add -- <component> [component...]")
  process.exit(1)
}

const run = (cmd) => execSync(cmd, { cwd: pkgDir, stdio: "inherit" })

// 1. Install shadcn component(s)
console.log(`\n  Adding: ${components.join(", ")}\n`)
run(`npx shadcn@latest add --overwrite ${components.join(" ")}`)

// 2. Fix Slot.Root type incompatibility
console.log("\n  Fixing Slot.Root types…")
run("node scripts/fix-slot-types.mjs")

// 3. Format
console.log("\n  Formatting…")
run("npx prettier --write src/components src/hooks 2>/dev/null || true")

console.log("\n  Done ✔\n")
