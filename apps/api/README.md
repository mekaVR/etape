# @etape/api

Backend NestJS du projet Etape.

## Stack

- NestJS 10
- Prisma 7 + PostgreSQL (avec `@prisma/adapter-pg`, `moduleFormat = "cjs"`)
- JWT (access token header + refresh token httpOnly cookie)

## Setup initial

```bash
# Depuis la racine du monorepo
npm install
```

`npm install` lance automatiquement `prisma generate` via le hook `postinstall` — le client Prisma est généré dans `apps/api/src/generated/prisma`.

Configurer la base de données :

```bash
cp apps/api/.env.example apps/api/.env
# Renseigner DATABASE_URL
npm run db:migrate -w apps/api
```

## Développement

```bash
# Depuis la racine
npm run dev
```

Lance toute la stack via Turborepo. Le client Prisma est régénéré avant chaque démarrage (dépendance `db:generate` dans `turbo.json`).

## Workflow Prisma

### Modifier le schéma

1. Éditer `apps/api/prisma/schema.prisma`
2. Créer la migration :
   ```bash
   npm run db:migrate -w apps/api -- --name <nom_explicite>
   ```
3. Commiter `schema.prisma` **et** la migration en même temps.

### Règles d'or

- **Toujours** versionner `schema.prisma` et `prisma/migrations/`.
- **Jamais** versionner `apps/api/src/generated/` (c'est généré, c'est gitignored).
- **Jamais** modifier une migration déjà mergée sur `develop` — créer une nouvelle migration à la place.
- Les versions des packages `prisma`, `@prisma/client` et `@prisma/adapter-pg` sont **figées** (pas de `^`) pour garantir un client identique entre devs.

### Après un `git pull`

Si le schéma a bougé :

```bash
npm install                         # postinstall regen le client
npm run db:migrate -w apps/api      # applique les nouvelles migrations
```

## Scripts utiles

| Script | Rôle |
|---|---|
| `npm run dev -w apps/api` | NestJS en watch mode |
| `npm run db:generate -w apps/api` | Régénère le client Prisma |
| `npm run db:migrate -w apps/api` | Crée + applique une migration en local |
| `npm run db:migrate:deploy -w apps/api` | Applique les migrations en prod (CI) |
| `npm run check-types -w apps/api` | Vérifie les types sans build |
| `npm run lint -w apps/api` | Lint + autofix |

## Structure

```
apps/api/
  prisma/
    schema.prisma          ← source de vérité
    migrations/            ← versionné
  src/
    generated/prisma/      ← gitignored (généré)
    ...
```
