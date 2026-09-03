# Shiftby.pro design system

This document defines the reusable visual rules for the Astro publication. It is a publishing system, not a component showcase. New pages should reuse these rules unless a brief records a deliberate exception.

## Design principles

- Evidence before decoration.
- Calm editorial hierarchy over dashboard density.
- One clear reading path per section.
- Current, historical and uncertain states remain visibly distinct.
- AI may assist the work; the interface must not imply automated authority.

## Foundations

The source of truth is `src/styles/tokens.css`.

### Colour

Use the existing tokens rather than page-specific colours:

- `--surface-page` — page background
- `--surface-subtle` — cards and quiet panels
- `--surface-diagram` — diagrams and evidence plates
- `--text-primary`, `--text-secondary`, `--text-muted`, `--text-faint` — text hierarchy
- `--accent`, `--accent-strong` — links, labels and active state
- `--border`, `--border-strong` — rules and structural boundaries
- `--status-active` — active/current signal

### Typography

- Instrument Serif: editorial display headings on the homepage and broad publication surfaces.
- DM Sans: article headings, body copy, interface text and data tables.
- DM Mono: eyebrows, metadata, status, dates and compact evidence labels.

Do not use Instrument Serif for long-form body copy. Keep article prose at the shared reading width.

### Spacing and widths

Use the `--space-*` scale. Use `--container` for page framing and `--reading-width` (or the article prose width) for sustained reading. Avoid introducing a second spacing scale or arbitrary max-widths.

## Page patterns

### Homepage

Purpose: establish the publication proposition and route readers into fieldwork.

Required structure: proposition → founding note → work in progress → publication method.

### Project hub

Purpose: explain one project, its current boundary and its fieldwork hand-off.

Required structure: project promise → model/visual → current state → fieldwork entry.

### Archive

Purpose: let readers scan and filter notes at any scale.

Use archive rows/cards with title, description, purpose/format, project, date and status. Do not rely on position or colour alone to communicate status.

### Article

Purpose: provide one bounded editorial argument, method, report or explanation.

Use the shared article shell: breadcrumbs → identity metadata → lede → prose → evidence or method surfaces → boundary → continuation.

## Reusable components

- `SiteHeader` / `SiteFooter`
- `FieldworkArticle`
- article breadcrumbs and identity metadata
- evidence figure with explicit caption boundary
- responsive contribution/data table
- archive card/row
- status label and currentness indicator
- fieldwork end matter and continuation link
- diagrams and process flows

New components should have one responsibility, a semantic HTML root and a mobile state.

## Image roles

1. **Evidence image** — shows a real source, interface or working record; caption must state what it supports and does not prove.
2. **Representative image** — helps a reader understand a note in an archive or search result; it must not be mistaken for evidence.
3. **Social card** — 1200×630 share image; represents the note, but is not evidence.

Generated or edited visuals may crop, redact, annotate or recompose real material. They must not invent counts, relationships, system state or external results.

## Motion and interaction

Motion is optional and subordinate to reading:

- use short, low-amplitude transitions for entry, hover and focus;
- never hide essential content behind animation;
- respect `prefers-reduced-motion: reduce`;
- do not add client-side JavaScript where a static link or CSS state is sufficient.

## Responsive rules

- Design for 320px minimum width.
- Preserve readable line length and generous vertical rhythm.
- Convert wide tables to labelled stacked records where appropriate.
- Provide purpose-built mobile artwork when a desktop crop becomes illegible.
- Test keyboard focus, headings, captions, image alt text and table headers at mobile width.

## Content and metadata contract

Every public note requires validated values for series, project, purpose, format, work domains, themes, current/publication status, audience and social metadata. The content schema is the gate; page templates must not silently infer missing editorial meaning.

## Extension rule

When a new project or note type is added:

1. reuse the existing page and component pattern;
2. add only the taxonomy value required by the editorial brief;
3. document any visual exception here;
4. run `npm run check`, production build, and desktop/mobile preview QA.

The design system is considered stable when a new project can use the shared shell, archive and article patterns without duplicating layout CSS.
