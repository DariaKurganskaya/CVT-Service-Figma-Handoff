# CVT Service — Figma handoff

This repository contains the exact source, used assets and responsive measurements for rebuilding the current CVT Service website in Figma.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Project layout

- `app/` — current React / Next App Router source.
- `public/` — only assets used by the current page.
- `figma-handoff.md` — design, interaction and asset specification.
- `sections-*.json` — computed DOM geometry and styles for 1200, 960, 640, 480 and 320 px viewports.
- `screenshots/<viewport>/full-page.png` — full-page visual references.

The project deliberately uses `app/` rather than `src/`; it has no `src/` directory. Assets are served directly from `public/` to preserve the URLs used by the production code.
