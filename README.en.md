# Nemiga Tower

[Русский](./README.md) | **English**

Premium showcase landing page for a business-center portfolio concept. The project is built as a single-page website focused on visual polish, responsive behavior, accessibility, first-load performance, and a stable GitHub Pages deployment flow.

[Live URL](https://ai-nikitka93.github.io/NemigaTower/)  
[Repository](https://github.com/AI-Nikitka93/NemigaTower/)

## Overview

Nemiga Tower is a polished real-estate style showcase that demonstrates premium art direction, section-based navigation, a rental calculator, branded media blocks, responsive mobile layouts, and basic visual automation through Playwright snapshots.

## Features

- premium dark/gold visual language with glassmorphism and layered lighting
- section navigation without page reloads
- rental calculator with live recalculation and NBRB exchange rate
- accessible modals, `skip-link`, `focus-visible`, `prefers-reduced-motion`
- responsive mobile layouts for key screens
- desktop and mobile visual regression suite
- automatic GitHub Pages deployment via GitHub Actions

## Stack and Services

### Core stack

- `HTML5`
- `Tailwind CSS CDN`
- `Vanilla JavaScript`
- `Node.js / npm`
- `Playwright`

### External services and integrations

- `GitHub Pages` for hosting
- `GitHub Actions` for build and deploy
- `NBRB API` for exchange rates in the calculator
- `Google Fonts` for `Manrope` and `Inter`
- `Material Symbols` for icons

## Commands

```bash
git clone https://github.com/AI-Nikitka93/NemigaTower.git
cd NemigaTower
npm install
npm run serve
```

Default local URL: `http://127.0.0.1:41873/`

Additional commands:

```bash
npm run build
npm run serve
npm run test:visual
npm run test:visual:update
```

## What the build does

- creates a clean `dist/` directory
- copies `index.html`
- detects and copies only actually referenced assets
- creates `.nojekyll`
- generates `build_metadata.json` with version, build date, and `git_sha`

## Project Structure

```text
NemigaTower/
├── .github/workflows/pages.yml   # GitHub Pages deployment workflow
├── assets/                       # Local images and brand assets
├── scripts/build.mjs             # Production build for dist
├── tests/visual.spec.js          # Visual regression tests
├── tests/__screenshots__/        # Desktop/mobile baseline screenshots
├── index.html                    # Main UI file
├── package.json                  # Build/serve/test scripts
├── playwright.config.js          # Playwright config
├── README.md                     # Russian version
└── README.en.md                  # English version
```

## Visual Regression

The suite covers:

- desktop `home`
- desktop `infrastructure`
- desktop `offices`
- desktop `contacts`
- desktop `media tour`
- mobile `home`
- mobile `infrastructure`
- mobile `offices`
- mobile `contacts`
- mobile `media tour`

Key baselines:

- [home-desktop.png](./tests/__screenshots__/home-desktop.png)
- [home-mobile.png](./tests/__screenshots__/home-mobile.png)
- [infrastructure-mobile.png](./tests/__screenshots__/infrastructure-mobile.png)
- [offices-mobile.png](./tests/__screenshots__/offices-mobile.png)
- [contacts-mobile.png](./tests/__screenshots__/contacts-mobile.png)
- [media-tour-mobile.png](./tests/__screenshots__/media-tour-mobile.png)

## Public Contacts and Project Metadata

- Public email used on the site: `rent@nemigatower.by`
- Git author email present in repository history: `nikitka93@example.com`
- Author: `Nikita (AI_Nikitka93)`

## Limitations

- this is a demo project, not a real business-center website
- forms are showcase-only and do not submit to a backend
- part of the runtime resources still comes from external CDNs

## Author

Created by Nikita (AI_Nikitka93)
