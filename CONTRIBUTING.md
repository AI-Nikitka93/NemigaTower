# Contributing

Thanks for helping improve Nemiga Tower. This repository is a public-facing demo site, so the goal of every contribution is to keep the landing page easy to run, easy to review, and visually stable.

## Before You Start

- Use `Node.js 20+`, `npm`, and `Python 3`.
- Read the root [`README.md`](./README.md) first for the current quickstart and project scope.
- Treat the repository as a portfolio/demo surface, not a production SaaS backend.

## Local Setup

```bash
git clone https://github.com/AI-Nikitka93/NemigaTower.git
cd NemigaTower
npm install
npm run serve
```

Default local URL: `http://127.0.0.1:41873/`

## Checks To Run

Run the smallest relevant checks before opening a pull request:

```bash
npm run build
npm run test:visual
```

If your change intentionally alters the UI, update the screenshots with:

```bash
npm run test:visual:update
```

## What Good Contributions Look Like

- keep the quickstart runnable without extra hidden steps
- preserve accessibility details such as keyboard access, visible focus states, and reduced-motion behavior
- prefer clear copy and practical documentation over decorative README churn
- keep GitHub Pages deployment working from the default branch
- update both [`README.md`](./README.md) and [`README.ru.md`](./README.ru.md) when public-facing repository messaging changes

## Pull Requests

- Keep pull requests focused and explain the user-facing reason for the change.
- Include screenshots or before/after notes for visual updates.
- Call out any external dependency changes, especially CDN, fonts, or API usage.
- Mention whether visual baselines were updated on purpose.

## Issues

- Use the issue forms in [`.github/ISSUE_TEMPLATE`](./.github/ISSUE_TEMPLATE) for bugs and feature requests.
- Include reproduction steps, environment details, and screenshots when relevant.
- Route general help requests through [`SUPPORT.md`](./SUPPORT.md) so bugs stay actionable.
- Do not report security issues in public tickets. Follow [`SECURITY.md`](./SECURITY.md) instead.
