# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bytes Bourbon BBQ is a static site built with **Astro 5** that combines BBQ recipes with cybersecurity metaphors. Each recipe pairs a cooking technique with a cyber concept (e.g., data encapsulation, payload delivery, SOC operations).

## Commands

- `npm run dev` — Start dev server with hot reload
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview the built site
- `npm run clean` — Remove `dist/` directory

No test runner or linter is configured.

## Architecture

**Stack:** Astro 5, Tailwind CSS 3.4, MDX, TypeScript. Output is fully static HTML (no SSR).

### Content Collections (`src/content/`)

Three collections defined in `src/content/config.ts` with Zod schemas:
- **recipes** — Markdown files in `src/content/recipes/`. Rich frontmatter: `title`, `description`, `date`, `image`, `cyber_concept`, `prep_time`/`cook_time`/`total_time`, `servings`, `difficulty` (easy|intermediate|advanced), `ingredients`/`instructions` (string arrays), `custom_spice_blend`, `aar` (After Action Report with `worked`/`adjust`/`lessons`), `featured`, `draft`.
- **posts** and **guides** — Schemas defined but no content files yet.

### Layouts (`src/layouts/`)

- `BaseLayout.astro` — Site shell: sticky header, responsive mobile nav toggle, footer, Plausible analytics, global prose styling.
- `RecipeLayout.astro` — Wraps BaseLayout. Renders recipe hero image, metadata badges (cook time, difficulty, tags), structured ingredient/instruction lists, spice blend section, AAR section with color-coded boxes. Generates **Schema.org Recipe JSON-LD** with ISO 8601 duration conversion.

### Pages (`src/pages/`)

- `/` — Homepage: hero, latest 6 recipes grid, newsletter CTA
- `/recipes/` — Full recipe archive grid
- `/recipes/[slug]` — Dynamic recipe pages using `getStaticPaths()`
- `/about/` and `/contact/` — Static pages

### Data (`src/data/site.ts`)

Centralized site config: metadata, author info, navigation links, Mailchimp newsletter URL, randomized delivery taglines.

### Styling

Tailwind with custom theme tokens in `tailwind.config.mjs`:
- Color scales: `bbq` (browns), `sauce` (reds), `smoke` (grays), `fire` (oranges), `cyber` (cyans)
- Font: JetBrains Mono
- Custom animations: `herofade`, `glow-pulse`
- Custom shadows: `card`, `glow`

Dark theme throughout (black/neutral backgrounds, fire-orange accents).

## Content Conventions

- Every recipe includes a `cyber_concept` frontmatter field tying the cooking method to a cybersecurity idea
- Recipes end with an AAR (After Action Report) structured as worked/adjust/lessons
- Time fields (`prep_time`, `cook_time`, `total_time`) are human-readable strings (e.g., "45 minutes") — `RecipeLayout` converts them to ISO 8601 durations for schema markup
- Images are stored in `public/images/` and referenced as URL strings in frontmatter
