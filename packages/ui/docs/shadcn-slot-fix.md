# Fix automatique shadcn pour monorepo (React 19)

## Contexte

La CLI shadcn genere du code prevu pour une app standalone (Next.js). Dans notre monorepo, ou `packages/ui` est un **package lib partage**, deux problemes apparaissent a chaque `shadcn add` :

### 1. Imports `@/` incompatibles avec Vite

shadcn genere des imports avec l'alias tsconfig `@/` :

```tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/button"
```

Ca fonctionne pour TypeScript (via `tsconfig.json` paths), mais **Vite** dans les apps consommatrices (`transition-pro`, `fongesoft`) ne sait pas resoudre `@/` pour des fichiers venant de `packages/ui`. Chaque app resout `@/` vers son propre `src/`, pas celui du package.

Les imports doivent utiliser les **exports du package** :

```tsx
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
```

### 2. Types `Slot.Root` incompatibles avec React 19

shadcn genere ce pattern pour les composants `asChild` :

```tsx
const Comp = asChild ? Slot.Root : "button"
return <Comp {...props} />
```

Ca cree une **union de types** `typeof Slot.Root | "button"`. TypeScript exige que `props` soit compatible avec les deux branches. Avec **React 19 + TypeScript strict**, ca casse :

- `Slot.Root` attend `onChange: ChangeEventHandler<HTMLElement>` (generique)
- `"button"` attend `onChange: ChangeEventHandler<HTMLButtonElement>` (strict)

Resultat : **erreur TS2322** sur chaque composant qui utilise `asChild`.

## Pourquoi ca ne sera pas fix upstream

- **Cote Radix** : `SlotProps` utilise `HTMLAttributes<HTMLElement>` volontairement — Slot ne sait pas quel element il wrap. Changer ca casserait l'API publique (breaking change).
- **Cote shadcn** : leur philosophie est "tu possedes le code". Les templates de la CLI ne sont pas maintenus apres generation. Aucune PR en cours pour corriger le pattern.
- **En pratique** : la majorite des projets shadcn tournent avec `skipLibCheck: true` dans une app Next.js — l'erreur est invisible. Nous, on a un **package lib** (`packages/ui`) qui valide ses propres types sans `skipLibCheck`, donc l'erreur apparait.

> Issues liees :
> - [shadcn-ui/ui #6805](https://github.com/shadcn-ui/ui/issues/6805)
> - [shadcn-ui/ui #5512](https://github.com/shadcn-ui/ui/issues/5512)
> - [radix-ui/primitives #3199](https://github.com/radix-ui/primitives/issues/3199)

## Les fix appliques par le script

### Phase 1 — Rewrite des imports

```tsx
// Avant (genere par shadcn)
import { cn } from "@/lib/utils"
import { Button } from "@/components/button"
import { useIsMobile } from "@/hooks/use-mobile"

// Apres
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
```

### Phase 2 — Split du pattern Slot.Root

```tsx
// Avant (genere par shadcn — casse)
const Comp = asChild ? Slot.Root : "button"
return <Comp {...props} />

// Apres (fix applique par le script)
if (asChild) {
  return (
    <Slot.Root
      {...(props as React.ComponentProps<typeof Slot.Root>)}
    />
  )
}
return <button {...props} />
```

## Pipeline automatise

Au lieu d'appliquer ces fix a la main a chaque `shadcn add`, on a un wrapper :

```bash
cd packages/ui
npm run ui:add -- sidebar           # un composant
npm run ui:add -- dialog accordion  # plusieurs
```

> **Ne pas utiliser `npx shadcn add` directement** — toujours passer par `npm run ui:add`.

Ca execute dans l'ordre :

1. `npx shadcn@latest add --overwrite <composant>`
2. `node scripts/fix-slot-types.mjs` — rewrite les imports `@/` + corrige le pattern Slot.Root
3. `prettier --write` — reformate

Le script est **idempotent** : le relancer sur des fichiers deja corriges ne fait rien.

## Fichiers

| Fichier | Role |
|---------|------|
| `scripts/ui-add.mjs` | Wrapper qui chaine les 3 etapes |
| `scripts/fix-slot-types.mjs` | Codemod (phase 1 : imports, phase 2 : Slot.Root) |
| `components.json` | Alias `ui` pointe vers `@/components` (install a plat, pas de sous-dossier `ui/`) |

## Point d'attention `components.json`

L'alias `ui` a ete change de `@/components/ui` vers `@/components` pour que shadcn installe les composants **a plat** dans `src/components/` (pas dans un sous-dossier `src/components/ui/`). Ca correspond aux exports du `package.json` :

```json
"exports": {
  "./components/*": "./src/components/*.tsx"
}
```
