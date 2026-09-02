# DESIGN.md — askai

> This file is the single source of truth for UI decisions in this project. Palette, typography, and
> spacing below were extracted from the existing codebase on 2026-09-02, not invented.

## Read this first (instructions to the AI)

- **Read this entire file before generating or modifying any UI.** Re-read it every session, not
  just once, this file does not stay in context on its own.
- **Do not invent colors, fonts, spacing values, or components that aren't listed here.** If
  something you need isn't defined below, stop and ask, don't improvise a plausible-looking value.
- **The palette below is the existing, working palette. Keep it.** Do not propose a replacement
  palette, do not add an accent "just for this section", do not swap the green primary for an indigo
  or blue. Extraction has already happened; there is nothing left to re-derive.
- **Every UI-generating prompt gets checked against this file first.** If a request conflicts with
  something here, say so explicitly, don't silently override either the request or the file.
- **Log every change to this file** in the Change Log section at the bottom, with a date and a
  one-line reason. Palette/token drift over many sessions is exactly what this file exists to stop.

## Design philosophy

A working tool for people who run AI meetings back to back: dense tables, fast scanning, status you
can read at a glance. The interface should stay out of the way of the transcript, the summary, and
the call itself. Utility over marketing polish everywhere except the signed-out auth screens.

> Not yet confirmed by the project owner — this was inferred from the codebase (data tables,
> paginated lists, status enums, sidebar app shell). Correct it if it's wrong; everything below it
> is extracted fact and does not depend on it.

## Palette

Source of truth: `src/app/globals.css`. Tokens are OKLCH, exposed to Tailwind v4 through the
`@theme inline` block, consumed as `bg-background`, `text-muted-foreground`, `border-border`, etc.
shadcn base color is `neutral` — every non-primary color is a true neutral (chroma `0`).

### Core tokens

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Body/heading text |
| `--card` / `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Cards, panels, popovers |
| `--card-foreground` / `--popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Text on those surfaces |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Muted surface fills |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Secondary/supporting text |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Dividers, outlines |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | Field borders |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus ring |
| `--primary` | `oklch(0.63 0.1699 149.21)` **(green)** | `oklch(0.922 0 0)` | Primary action, links |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Text on primary |
| `--secondary` / `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Secondary buttons, hover fills |
| `--secondary-foreground` / `--accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | Text on those |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Error/destructive **state only** |

**The accent is green** — `oklch(0.63 0.1699 149.21)`. It is the only chromatic color in the core
set. There is no blue, no indigo, no purple in this project.

### Sidebar tokens

The sidebar has its own scale and is the one place with a distinct chromatic surface — a dark
desaturated teal-green. Do not reuse these tokens outside the sidebar.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--sidebar` | `oklch(0.2 0.0283 174.92)` | `oklch(0.205 0 0)` | Sidebar background |
| `--sidebar-foreground` | `oklch(0.82 0.0057 182.99)` | `oklch(0.985 0 0)` | Sidebar text |
| `--sidebar-accent` | `oklch(0.34 0.0601 171.21)` | `oklch(0.269 0 0)` | Active item background |
| `--sidebar-accent-foreground` | `oklch(1 0 0)` | `oklch(0.985 0 0)` | Active item text |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` | Sidebar primary |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` | Text on it |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Sidebar dividers |
| `--sidebar-ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Sidebar focus ring |

### Status tokens

Meeting status is the one place beyond `--destructive` where colour carries meaning. Five tokens,
used as the text colour and, at 10% alpha, as the fill; borders at 20%. Light values sit near
`L 0.5` so text clears AA on a white card.

| Token | Light | Dark |
|---|---|---|
| `--status-upcoming` | `oklch(0.52 0.12 75)` | `oklch(0.78 0.13 75)` |
| `--status-active` | `oklch(0.52 0.14 250)` | `oklch(0.72 0.13 250)` |
| `--status-completed` | `oklch(0.5 0.13 150)` | `oklch(0.75 0.14 150)` |
| `--status-cancelled` | `oklch(0.52 0.17 25)` | `oklch(0.72 0.16 25)` |
| `--status-processing` | `oklch(0.5 0.02 250)` | `oklch(0.72 0.02 250)` |

Exposed to Tailwind as `bg-status-*`, `text-status-*`, `border-status-*`. Status is never carried by
colour alone — every badge also has an icon and the status word.

### Chart tokens

`--chart-1` … `--chart-5` exist in both themes (shadcn defaults, unmodified). Data visualization
only. Never pull a chart color into general UI.

### No general success / warning tokens

Beyond `--destructive` and the status set above, there are no semantic state colours. If a general
`--success` / `--warning` is genuinely needed, **ask before adding it** — and derive it from the
existing green rather than introducing a new hue.

No other colors exist in this project. Don't invent a new accent for a "special" section.

### Radius

`--radius: 0.625rem` (10px), with `--radius-sm` = `radius - 4px`, `--radius-md` = `radius - 2px`,
`--radius-lg` = `radius`, `--radius-xl` = `radius + 4px`. In use: `rounded-md` (43), `rounded-lg`
(32), `rounded-full` (19), `rounded-sm` (14), `rounded-none` (9), `rounded-xl` (2).

## Typography

- **Body font:** **Inter** (`next/font/google`, `subsets: ["latin"]`, loaded in
  `src/app/layout.tsx` and applied via `inter.className` on `<body>`) — used for everything.
- **Display/heading font:** **none — the project ships a single typeface.** Headings are
  differentiated by size and weight only.

> **Known conflict with the template's "never use the same face for both roles" rule.** This project
> currently violates it, deliberately or not. Do **not** silently add a second font to satisfy the
> rule. If a display face is wanted, that is a palette-level decision — propose it, get confirmation,
> and log it below.

> **Known bug, not a design decision:** `globals.css` maps `--font-sans: var(--font-geist-sans)` and
> `--font-mono: var(--font-geist-mono)`, but neither variable is ever defined — `layout.tsx` loads
> Inter through `className`, not a CSS variable. So the `font-sans` / `font-mono` Tailwind utilities
> resolve to nothing and fall back to the browser default. The two `font-mono` usages in the
> codebase are currently not monospace. Worth fixing; flagging rather than changing it here.

### Type scale (in use, Tailwind defaults)

| Role | Class | Size | Count in codebase |
|---|---|---|---|
| `display` | `text-5xl` / `text-4xl` | 48px / 36px | 1 / 1 (auth + home only) |
| `heading-lg` | `text-3xl` | 30px | 2 |
| `heading-md` | `text-2xl` | 24px | 11 |
| `heading-sm` | `text-xl` | 20px | 12 |
| `subhead` | `text-lg` | 18px | 14 |
| `body` | `text-base` | 16px | 4 |
| `label` | `text-sm` | 14px | **86 — the workhorse** |
| `caption` | `text-xs` | 12px | 24 |

`text-sm` is the default body size for app interiors; `text-base` is the exception, not the rule.

### Weights in use

`font-medium` (60), `font-semibold` (18), `font-bold` (6), `font-normal` (6). Headings are
`font-semibold` or `font-medium` — **not** `font-bold` by default.

## Spacing scale

Tailwind's default 4px scale. Values actually in use, in frequency order:

`2` (0.5rem/8px) · `4` (16px) · `1` (4px) · `1.5` (6px) · `3` (12px) · `8` (32px) · `6` (24px) ·
`5` (20px) · `2.5` (10px) · `0` · `10` (40px) · `12` (48px) · `0.5` (2px)

Most common: `gap-2` (42), `px-2` (37), `gap-x-2` (27), `px-4` (25), `py-1.5` (21), `p-4` (19),
`gap-y-4` (18), `pl-8` (17).

Every margin/padding/gap comes from this list. Half-steps (`1.5`, `2.5`, `0.5`) are established in
this codebase for control-height tuning — they are allowed. **No arbitrary values** like `p-[13px]`.

Existing arbitrary values are limited to sizing/positioning, never spacing: `ring-[3px]` (17, shadcn
focus convention), `rounded-[2px]`, `w-[92px]`, `w-[240px]`, `w-[200px]`, `min-h-[400px]`,
`max-h-[300px]`, `translate-y-[2px]`, `text-[10px]`. Don't add more.

## Layout archetype

Name the shape for **each page/section being built**, don't default to "hero + 3-column features"
because it's the most common thing in the training distribution:

- **Marquee** — editorial, left-biased, statement-led
- **Long Document** — letter-like, no marketing chrome, reads top to bottom
- **Bento** — irregular grid, size communicates importance
- **Stat-Led** — numbers/evidence carry the page, prose is secondary
- **Comparison** — alternatives placed on the same visual basis
- **Calculator/tool-led** — the interactive tool is the dominant object, not a recap below it

Pick one per screen. State it explicitly in the prompt before generating.

Already established in this codebase, match these rather than reinventing:
- **App shell** — persistent sidebar + navbar (`src/modules/dashboard/ui/components/`), content area
  is a padded column. All `(dashboard)` routes.
- **Table/list screen** — header row with primary action, search + filter bar, `DataTable`,
  pagination, empty state. Agents and Meetings index pages.
- **Detail screen** — breadcrumb header with actions menu, then state-specific body
  (`upcoming` / `active` / `completed` / `cancelled` / `processing` states). Meeting and agent detail.
- **Split auth** — two-column card, form left, brand panel right. `(auth)` routes.
- **Comparison** — pricing cards. `/upgrade`.

## Component source

Canonical primitive library: **shadcn/ui**, `new-york` style, `neutral` base, CSS variables enabled
(`components.json`). 46 primitives already vendored in `src/components/ui/`. Never build a button,
card, dialog, or nav from raw divs — compose from these.

Icons: **lucide-react** (`iconLibrary: "lucide"`). Never emoji.

Shared app-level components already built, check here before writing a new one:
`data-table`, `data-pagination`, `command-select`, `empty-state`, `error-state`, `loading-state`,
`generated-avatar`, `responsive-dialogue` (dialog on desktop, drawer on mobile), and the
`use-confirm` hook.

Other libraries in play: `sonner` (toasts), `react-hook-form` + `zod` (forms), `nuqs` (URL state),
`recharts` (charts), `next-themes`, `@dicebear` (avatars).

No second visual layer (Aceternity/Magic UI) is installed. Don't add one without asking.

## Hard bans — do not ship any of these

- Purple-to-blue/cyan gradient hero, `#4F46E5`/`#5E6AD2`-style indigo-by-default accents
  (**the accent here is green — see Palette**)
- Same typeface for display and body text
- Three equal-width columns with a centered icon-in-a-chip above each
- Full-viewport centered hero as the default opener
- Nested cards with no semantic reason to be nested
- `background-clip: text` gradient text, glows, blobs, glass effects, ornamental shadows
- Pure `#000`/`#fff` as a surface color, use layered tonal steps instead
- Emoji used as UI icons
- Badges/pills used for metadata or editorial labels just for decoration
- All-caps tracked eyebrows, decorative numbered labels, em dashes in headings
- Auto-scrolling marquees, simulated typing cursors, decorative pulsing/parallax/bounce
- Fabricated metrics, testimonials, or logos
- Repeated identical section silhouettes across unrelated content
- Mathematically perfect but rhythm-less spacing — technically fine, still reads as templated

Constraints outperform positive instructions here. "No purple gradients" works; "make it look
professional" does nothing.

> **Two pre-existing conflicts with this list, recorded, not silently fixed:**
> 1. Light `--background` and `--card` are `oklch(1 0 0)` — pure white — which the ban list rejects.
>    This is the shadcn default and is load-bearing across every screen. Changing it is a
>    palette change: propose and confirm, don't do it as a side effect of another task.
> 2. Single typeface (see Typography).
>
> The white overlays on the dark sidebar (`bg-white/5`, `bg-white/10`) and the light text on the
> dark pricing panel are intentional and on-purpose, not debt.
>
> Neither is license to add *new* violations.

## Motion

Default to stillness. Add motion only when it explains a state change, preserves continuity across
a transition, or confirms an action succeeded. Never gate content behind animation or reveal
sections on scroll as decoration. `tw-animate-css` is available and is what shadcn primitives use
for enter/exit — that is the ceiling, not a starting point.

## Interaction states

Every interactive component ships all states that apply: `default`, `hover`, `focus-visible`,
`active`, `disabled`, `loading`, `error`, `success`. Shipping only `default` is the tell that a
static screenshot was translated into markup instead of a working component.

Focus rings follow the shadcn convention already in the codebase: `ring-[3px]` with `--ring`.
`cursor: pointer` on non-disabled buttons is set globally in `globals.css` — don't re-add it.

## Accessibility baseline

Semantic HTML, one `h1`, ordered headings, visible focus states, keyboard-operable controls, text
alternatives for non-text content, WCAG AA contrast. Never rely on color alone to convey state —
meeting status especially, which currently leans on color plus an icon.

## Reference screenshots

Before starting a new screen, supply 2-3 real reference screenshots (not adjectives like "modern
and clean"). Ask for structure and rhythm to be extracted, typography role, spacing rhythm,
information hierarchy, not literal pixels copied.

## Self-review before returning output

Score the result 1-5 on: distinctiveness, hierarchy, execution, restraint. Anything below 3 gets
revised before it's shown, not shipped and fixed later. Render it, actually look at first viewport,
full page, light and dark themes, and responsive reflow before calling it done.

Dark mode is fully tokenized here (`.dark` class via `next-themes`) — a change that only looks right
in light mode is not done.

## Working process (one fix per prompt)

Don't ask for structure, interactions, and visual polish in one prompt. Three passes:
1. Structure — layout, hierarchy, content placement
2. Interactions — states, transitions, form behavior
3. Visual polish — final spacing/color/type pass

Overloaded prompts that try to fix everything at once tend to fix some things while breaking others.

---

## Change log

| Date | Change | Reason |
|---|---|---|
| 2026-09-02 | Added five `--status-*` tokens | Meeting status badges used raw Tailwind yellow/blue/green/rose/gray at pale opacity — off-palette and poor contrast. Confirmed with the project owner before adding. |
| 2026-09-02 | Initial extraction from existing codebase | Palette from `src/app/globals.css`, typography from `src/app/layout.tsx` + measured class usage, spacing from measured class usage across `src/**/*.tsx`. No new tokens introduced. |
