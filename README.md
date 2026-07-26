# Translogistik

### Kitchen transport & assembly — multi-page brand experience

<p align="center">
  <a href="https://translogistik.vercel.app"><img src="https://img.shields.io/badge/Live-translogistik.vercel.app-B3232D?style=for-the-badge&labelColor=1B1A18" alt="Live demo" /></a>
  &nbsp;
  <img src="https://img.shields.io/badge/Stack-HTML5_%7C_CSS3_%7C_Vanilla_JS-31302D?style=for-the-badge&labelColor=1B1A18" alt="Stack" />
  &nbsp;
  <img src="https://img.shields.io/badge/Build-Zero_config-2D7D55?style=for-the-badge&labelColor=1B1A18" alt="Zero build" />
</p>

<p align="center">
  <strong>Static multi-page site</strong> for a German logistics brand:<br/>
  transport → handling → on-site kitchen assembly, with 9 locations and a motion-first UI.
</p>

<p align="center">
  <a href="https://translogistik.vercel.app"><strong>→ Open live site</strong></a>
  ·
  <a href="#architecture">Architecture</a>
  ·
  <a href="#local-development">Local run</a>
</p>

---

## Why this project

Most logistics sites feel like a PDF. This one feels like a product:

| | |
|---|---|
| **Motion with meaning** | Scroll-linked route SVG, filmstrip stages, reduced-motion safe |
| **Map as product UI** | Interactive Germany map + search across 9 Standorte |
| **Design system** | Tokens-first CSS (`tokens.css`) — colour, space, motion in one place |
| **Zero build tax** | No React, no bundler — ships as pure HTML/CSS/JS on Vercel |

Built as a **client-facing showcase**: clean information architecture, accessibility hooks (`aria-*`, keyboard, focus), and modular pages (home, career, location, legal).

---

## Live

| | |
|---|---|
| **Production** | [translogistik.vercel.app](https://translogistik.vercel.app) |
| **Repository** | [github.com/Evreu1pro/translogistik](https://github.com/Evreu1pro/translogistik) |
| **Author** | [Evreu1pro](https://github.com/Evreu1pro) · Leipzig, Germany |

---

## Architecture

```
translogistik/
├── index.html                  # Home — hero, process, map, career, brands
├── ueber-uns.html              # Company story + fleet video (HEUTE)
├── offene-stellen.html         # Careers index
├── kuechenmonteur.html         # Job detail
├── translogistik-muenchen.html # Location page (München)
├── impressum.html / datenschutz.html / 404.html
├── vercel.json                 # Clean URLs + cache headers
├── package.json                # Optional local static server
└── assets/
    ├── brand/                  # Logo kit (logo.svg, logo.png)
    ├── css/                    # tokens, styles, page sheets
    ├── js/                     # main, site-nav, muenchen, ueber-uns
    ├── video/                  # fleet-heute.mp4
    └── img/
        ├── home/               # hero, process-01…03, map
        ├── about/              # Über-uns photography + career portrait
        ├── careers/            # jobs hero + kuechenmonteur/*
        ├── brands/             # partner logos
        ├── locations/          # Standort art + photos
        └── ui/                 # decorative / spare vectors
```

### Page map

| Route | Role |
|-------|------|
| `/` | Brand home — proof bar, 3-step process, DE map, career day, Krieger network |
| `/ueber-uns` | Company story with chapter scroll + fleet video |
| `/offene-stellen` | Open roles |
| `/kuechenmonteur` | Role deep-dive |
| `/translogistik-muenchen` | Standalone Standort (München default on map) |
| `/impressum` · `/datenschutz` | Legal |
| `/404` | Fallback for locations without a dedicated page |

### Design tokens

All colour / type / motion knobs live in `assets/css/tokens.css`:

```css
--canvas  #F7F5F1   /* warm paper ground */
--ink     #1B1A18   /* primary text */
--red     #B3232D   /* brand CTA */
--ease    cubic-bezier(.22, .7, .2, 1)
```

Change the brand once — every page follows.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Markup | Semantic HTML5 | SEO, a11y, no hydration cost |
| Style | Modular CSS + tokens | Fast, cacheable, no runtime CSS-in-JS |
| Logic | Vanilla ES modules (IIFE) | Zero bundle, readable, maintainable |
| Deploy | Vercel static | Edge CDN, clean URLs via `vercel.json` |
| Motion | CSS + scroll metrics | Respects `prefers-reduced-motion` |

---

## Features

- **Hero route animation** — SVG path intensity tied to scroll (`--route`)
- **Process filmstrip** — 3 stages, tabs, swipe, scroll-scrub on desktop
- **Interactive DE map** — 9 cities, SVG markers, live search, deep-link to München
- **Career narrative** — intersection-observer day steps
- **Brand network cards** — accordion for Krieger / retail partners
- **Location page wizard** — multi-step inquiry form (München)
- **Shared site chrome** — `site-nav.js` keeps secondary pages consistent

---

## Local development

No install required for the site itself.

```bash
# clone
git clone https://github.com/Evreu1pro/translogistik.git
cd translogistik

# option A — any static server
npx serve . -l 4173

# option B — npm script
npm start
```

Open [http://localhost:4173](http://localhost:4173).

---

## Production notes

- Partner contact placeholders on the München page are intentional until legal sign-off.
- Brand links, Impressum, and Datenschutz should be reviewed before go-live with the client.
- Prefer editing **tokens** over hard-coded colours in page CSS.

---

## Author

**Evreu1pro** — AI web developer · Python / TypeScript / HTML / CSS / JS · Vercel · Open Source  
Leipzig, Germany · [github.com/Evreu1pro](https://github.com/Evreu1pro) · [evreu1pro.github.io](https://evreu1pro.github.io)

---

<p align="center">
  <sub>Crafted as a portfolio showcase — clean structure, real product feel, zero build debt.</sub>
</p>
