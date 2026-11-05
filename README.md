# Sea to Shining Sea

An Obsidian Legion field journal for domestic war correspondence. Ocean photography, editorial typography, regional reporting briefs, a selectable map, and distraction-free reading pages.

Live site: https://Obsidian-Legion.github.io/sea-to-shining-sea/

## Built with Unison

`src/site.u` is the source of truth for content, the typed `Dispatch` model, shared components, page composition, HTML escaping, and six executable entry points. The build runs the actual Unison compiler and executes its compiled programs to generate complete HTML documents. Node only orchestrates UCM and copies browser assets. This is not a JavaScript site relabeled as Unison.

GitHub Pages serves static files; it does not run a persistent Unison service. Unison runs at build time. A small browser JavaScript file enhances filters, map selection, sharing, and mobile navigation. Reading and navigation work without JavaScript.

## Develop

Install [Unison 1.3.0](https://github.com/unisonweb/unison/releases/tag/release%2F1.3.0) and Node.js 24. Put `ucm` on PATH. No npm dependencies are required.

```sh
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4188/sea-to-shining-sea/.

The first build installs the official base library into the ignored, isolated `.ucm` codebase. It does not alter your personal Unison codebase. Windows builds set console code page 65001 for Unicode output. Build output lives in `dist/`.

- `src/site.u`: page content, dispatches, HTML generation, and output entry points.
- `public/styles.css`: responsive editorial design, print layout, reduced-motion support.
- `public/site.js`: progressive browser interactions.
- `public/assets`: checked-in photography, compass mark, and locally served fonts.
- `scripts/build.mjs`: UCM transcript compilation and execution.
- `scripts/check.mjs`: output, link, asset, and content-integrity checks.
- `.github/workflows/pages.yml`: Unison build and GitHub Pages deployment.

## Publishing and editing

The GitHub Actions workflow rebuilds and deploys on pushes to `main`. Repository Settings → Pages → Source must be **GitHub Actions**. Canonical links use `https://Obsidian-Legion.github.io/sea-to-shining-sea/`; change `sea.baseUrl` and `public/not-found.html` if the destination changes.

Edit the dispatch values and body sections in `src/site.u`. The four initial field files are **explicitly labeled editorial concepts**, not claims of actual reporting. Replace them with verified reporting, proper dates, source notes, and documentary photographs before presenting them as published journalism. The project currently has no newsletter backend, confidential tip channel, or invented contact details. Following uses GitHub's real repository watching functionality.

## Assets

Photography is downloaded from Unsplash and used illustratively. Sources are credited on the editorial standards page. Images are not evidence of events, interviews, or specific reporting locations. The geographic map is an original schematic, not a live tracker.

Fonts: DM Sans, DM Serif Display, and IBM Plex Mono, distributed under the SIL Open Font License; license files are included with the assets. Fonts are served locally. The site uses no analytics, cookies, tracking pixels, third-party scripts, or remote font requests. Hosting access logs remain governed by GitHub's policies.
