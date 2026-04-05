# Nemiga Tower

**Русский** | [English](./README.md)

Премиальный showcase-лендинг бизнес-центра для публичного портфолио. Репозиторий собран как компактный static-site surface: один основной UI-файл, аккуратный build-проход, визуальные проверки через Playwright и стабильный деплой на GitHub Pages.

[Live demo](https://ai-nikitka93.github.io/NemigaTower/) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md)

| Поверхность | Статус |
| --- | --- |
| Тип репозитория | `SaaS / app repository` demo |
| Runtime | `HTML` + `Tailwind CSS CDN` + `Vanilla JavaScript` |
| Проверка | Playwright visual regression для desktop и mobile |
| Деплой | GitHub Pages через [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) |
| Права на reuse | `UNLICENSED`, пока в корне нет `LICENSE` |

![Превью главной страницы Nemiga Tower](./docs/screenshots/site-live-home.png)

## Что Это За Репозиторий

Nemiga Tower показывает, как может выглядеть дорогой digital showcase для коммерческой недвижимости: сильный hero-блок, section-based навигация, калькулятор аренды, модальные сценарии, адаптивность и базовая автоматизация визуальной стабильности.

Этот репозиторий полезен, если нужно:

- показать premium UI в лёгком статическом стеке
- изучить одностраничный лендинг с вниманием к accessibility
- переиспользовать простой pipeline `build -> visual QA -> GitHub Pages`

## Быстрый Старт

Понадобится:

- `Node.js 20+`
- `npm`
- `Python 3`, потому что `npm run serve` поднимает локальный static server через `python -m http.server`

```bash
git clone https://github.com/AI-Nikitka93/NemigaTower.git
cd NemigaTower
npm install
npm run serve
```

Локальный адрес по умолчанию: `http://127.0.0.1:41873/`

Полезные команды:

```bash
npm run build
npm run serve
npm run test:visual
npm run test:visual:update
```

## Что Реализовано

- премиальный dark-and-gold landing page с навигацией по секциям без перезагрузки
- калькулятор аренды с live-пересчётом и данными НБ РБ
- доступные модалки, `skip-link`, `focus-visible` и поддержка reduced motion
- visual regression suite для ключевых экранов на desktop и mobile
- автоматический deploy статического артефакта на GitHub Pages

## Build И Deploy

Путь поставки намеренно держится коротким:

1. [`index.html`](./index.html) содержит основной UI, контент и интерактивность.
2. [`scripts/build.mjs`](./scripts/build.mjs) собирает `dist/`, копирует только реально используемые ассеты и пишет `build_metadata.json`.
3. Workflow [GitHub Actions](./.github/workflows/pages.yml) публикует содержимое `dist/` в GitHub Pages.

## Структура

```text
NemigaTower/
├── .github/
│   ├── workflows/pages.yml
│   ├── ISSUE_TEMPLATE/
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
├── assets/
├── docs/screenshots/
├── scripts/build.mjs
├── tests/visual.spec.js
├── tests/__screenshots__/
├── CONTRIBUTING.md
├── SECURITY.md
├── README.md
├── README.ru.md
└── index.html
```

## Качество И Вклад

- Базовые скриншоты лежат в [`tests/__screenshots__/`](./tests/__screenshots__).
- Contribution path описан в [`CONTRIBUTING.md`](./CONTRIBUTING.md).
- Базовые правила поведения собраны в [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
- Ownership для review зафиксирован в [`.github/CODEOWNERS`](./.github/CODEOWNERS).
- Шаблоны для обращений лежат в [`.github/ISSUE_TEMPLATE`](./.github/ISSUE_TEMPLATE).

## Статус Проекта

Это demo-репозиторий, а не production-сайт реального бизнес-центра. Формы служат для показа сценариев и не отправляют данные на backend. Часть runtime-зависимостей по-прежнему тянется из внешних CDN.

## Лицензия

Переиспользуемая open-source лицензия пока не добавлена. Пока в корне нет файла `LICENSE`, не стоит считать код и контент разрешёнными для reuse. В `package.json` это дополнительно отражено через `UNLICENSED`.
