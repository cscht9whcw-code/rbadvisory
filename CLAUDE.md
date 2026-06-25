# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page investment advisory website for **Red Beacon Asset Management**. Vanilla HTML/CSS/JS only — no build tools, no frameworks, no package.json.

## Running locally

Open `index.html` directly in a browser for layout/animation work. For the enquiry form (which uses `fetch`), serve over HTTP:

```
npx serve .
```

Or use VS Code Live Server. The form will silently fail on `file://` origins.

## Architecture

Three files, no compilation step:

- **index.html** — all markup. Semantic HTML5, ARIA labels on interactive elements. Sections in order: `#home` (hero), `#about`, `#services`, `#testimonials`, `#contact` (form), footer.
- **styles.css** — mobile-first. All design tokens in `:root` custom properties at the top of the file (colors, spacing, typography). Breakpoints at 580px, 768px, 1024px.
- **script.js** — four self-contained IIFEs: navbar (hamburger + scroll shadow), smooth scroll, IntersectionObserver reveal, testimonial carousel. The form handler is a fifth IIFE at the bottom.

## Form integration

The enquiry form POSTs JSON to `https://formsubmit.co/ajax/<email>`. The recipient email is set in `FORM_EMAIL` at the top of `script.js`. FormSubmit requires a one-time activation click before it delivers submissions.

## Key conventions

- CSS uses `var(--color-*)`, `var(--sp-*)`, `var(--font-*)` — always use these, never hardcode values.
- `.reveal` + IntersectionObserver drives all scroll animations; add the class to any element that should fade/slide in.
- Inline SVG icons are hand-coded directly in `index.html` — no icon library.
- `transition-delay` inline styles on sibling elements produce staggered reveals (see services cards and hero stats).
