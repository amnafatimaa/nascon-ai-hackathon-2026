# DAYBREAK architecture

This document describes the **initial frontend foundation** and the **intended** systems that will replace demonstration data. Nothing in the “future” sections is implemented unless a file in this repository says otherwise.

## Current frontend

```
app/                  App Router pages
  layout.tsx          Masthead chrome, fonts, metadata
  page.tsx            Landing
  onboarding/page.tsx Onboarding
  paper/page.tsx      Daily newspaper
  archive/page.tsx    Edition archive
components/
  layout/             Site header, navigation, footer
  onboarding/         Interest selection and flow
  newspaper/          Masthead, lead, cards, sections
  ui/                 Small shared interface pieces
lib/
  types.ts            Shared article / edition / profile types
  mock-data.ts        Demonstration newspaper
  storage.ts          localStorage helpers
  news/               Planned ingestion (stub)
  ai/                 Planned summarization (stub)
  personalization/    Planned ranking (stub)
  pdf/                Planned PDF export (stub)
```

UI components render `Article`, `NewsSection`, and `Edition` objects. They do not fetch RSS, call models, or write to a database.

Reader state today:

- `daybreak.onboarding.v1` — interests and reading preferences
- `daybreak.article-feedback.v1` — per-article more / skip / not interested

Both keys are browser-local and can later be migrated to a user profile.

## Intended news ingestion

1. Maintain a list of RSS (and later, site) sources in `lib/news`.
2. Poll on a schedule (morning edition window).
3. Normalize items onto `Article`: title, summary, source, canonical URL, published time, raw content reference.
4. Deduplicate by canonical URL, title similarity, and content hash.
5. Attach category and tags — first from source metadata, later from the AI layer.

No external news API is required for the first ingestion slice; RSS is enough.

## Intended AI layer

`lib/ai` will accept normalized articles and return:

- A brief and a detailed summary
- Category and tags
- A short “why this might matter” draft, later re-ranked against the reader

The newspaper must only present these as live once a real pipeline is wired. Sample pages should keep the demonstration disclaimer until then.

## Intended personalization

`lib/personalization` will combine:

- Onboarding interests and custom beats
- Summary length, edition size, local vs global emphasis
- Feedback signals (more like this, not interested, skip, read original)
- Implicit signals later (dwell time, scroll)

Output: an ordered list of article IDs for a given morning, plus section assignment (Front Page, Technology & Science, World Desk, Deep Read, Beyond Your Bubble).

## Intended storage

Replace localStorage with persisted records when authentication exists:

- `users` / `profiles`
- `interest_profiles`
- `articles` (canonical store after ingestion)
- `editions` (one per user per day, or a shared raw edition plus a per-user ranking)
- `article_feedback`
- `reading_history`

A hosted database can land in a later stage. An empty `supabase/` folder is reserved; it is unused in the foundation.

## Intended PDF generation

`lib/pdf` will render an edition (masthead, lead, columns) to a downloadable newspaper PDF. The current Download control is a visible placeholder so the reading UI does not pretend the file exists.

## Design constraints for later work

- Keep fetching, ranking, and rendering in separate modules.
- Continue to type articles the same way whether they come from mock data or RSS.
- Do not hide the demonstration banner until live ingestion is actually serving the paper.
