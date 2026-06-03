# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Note Next.js :** cette version peut avoir des breaking changes. Consulter `node_modules/next/dist/docs/` avant d'écrire du code Next.js.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Sanity CMS** — headless CMS, studio embarqué sur `/studio`
- Déployé sur **Vercel**

## Commandes

```bash
npm run dev       # serveur de développement (http://localhost:3000)
npm run build     # build de production
npm run lint      # ESLint
```

## Variables d'environnement

À créer en `.env.local` (local) et dans le dashboard Vercel (production) :

```
NEXT_PUBLIC_SANITY_PROJECT_ID=   # ID du projet sur sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                # token avec droits editor (server-side uniquement)
```

Après déploiement Vercel : ajouter le domaine dans **sanity.io/manage → API → CORS Origins**.

## Architecture

### Données (Sanity)

| Fichier | Rôle |
|---|---|
| `sanity/client.ts` | Client Sanity partagé (useCdn: true) |
| `sanity/image.ts` | Helper `urlFor()` pour les images Sanity |
| `sanity/queries.ts` | Toutes les requêtes GROQ (via `defineQuery`) |
| `sanity/schemas/` | Schémas de contenu |
| `sanity.config.ts` | Config du Studio Sanity |

**Schémas de contenu :** `artist`, `release` (Album/EP/Single/Mixtape), `show` (concerts).

### Pages

- `app/page.tsx` — page d'accueil
- `app/studio/[[...tool]]/page.tsx` — Sanity Studio embarqué (accessible sur `/studio`)

### Convention data-fetching

Toujours importer les requêtes depuis `sanity/queries.ts` et les exécuter via `client.fetch()` dans des Server Components. Les variables `NEXT_PUBLIC_*` sont exposées au client ; `SANITY_API_TOKEN` est strictement server-side.

## Images Sanity

```typescript
import { urlFor } from '@/sanity/image'
// Exemple :
<Image src={urlFor(release.coverArt).width(800).url()} />
```
