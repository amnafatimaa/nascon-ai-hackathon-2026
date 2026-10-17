# DAYBREAK

Your world. In print. Every morning.

DAYBREAK is an AI-powered personalized daily newspaper. It is designed to gather stories from many sources, learn a reader’s interests, and present them as a morning paper rather than a scrolling feed.

This repository currently contains the **initial product foundation**: an editorial frontend, a multi-step onboarding flow, a sample newspaper, and an archive shell. Live news ingestion, ranking, accounts, and PDF generation are not connected yet.

## Current technologies

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide icons
- Local storage for onboarding and article feedback

Serif and sans typefaces are bundled at build time through `next/font` and fall back to Georgia / system UI if needed. The running app does not call a font CDN.

## Install

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Other commands

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and product introduction |
| `/onboarding` | Interest and reading-preference flow |
| `/paper` | Sample daily newspaper |
| `/archive` | Demonstration list of previous editions |

## What is mock data

The newspaper, archive, headlines, summaries, sources, timestamps, and illustrations are **demonstration content** in `lib/mock-data.ts`. They are not verified reporting and are not fetched from publishers.

Onboarding choices and “more like this / not interested / skip” signals are stored in the browser with `localStorage`. They do not train a model yet.

Download PDF is intentionally marked coming soon.

## Planned next stages

1. RSS ingestion and article normalization
2. Deduplication, categorization, and summarization
3. Ranking against a stored interest profile
4. Persisted daily editions
5. PDF export
6. Accounts and long-term reading history

See [docs/architecture.md](docs/architecture.md) for the intended shape of those systems.
