# Nemiga Tower

**Русский** | [English](./README.en.md)

Премиальный showcase-лендинг бизнес-центра для портфолио. Проект сделан как одностраничный сайт с упором на визуальный polish, адаптивность, доступность, скорость первой загрузки и стабильный деплой на GitHub Pages.

[Live URL](https://ai-nikitka93.github.io/NemigaTower/)  
[Repository](https://github.com/AI-Nikitka93/NemigaTower/)

## Обзор

Nemiga Tower показывает, как может выглядеть дорогой digital-showcase для недвижимости и коммерческих пространств: тёмная премиальная палитра, сильный hero-блок, калькулятор аренды, мультимодальные секции, аккуратная мобильная версия и базовая визуальная автоматизация через Playwright.

## Что реализовано

- премиальный dark/gold visual language с glassmorphism и layered lighting
- навигация по секциям без перезагрузки страницы
- калькулятор аренды с live-пересчётом и курсом НБ РБ
- доступные модалки, `skip-link`, `focus-visible`, `prefers-reduced-motion`
- адаптивные mobile layouts для ключевых экранов
- visual regression suite для desktop и mobile
- автоматический GitHub Pages deploy через GitHub Actions

## Стек и сервисы

### Основной стек

- `HTML5`
- `Tailwind CSS CDN`
- `Vanilla JavaScript`
- `Node.js / npm`
- `Playwright`

### Внешние сервисы и интеграции

- `GitHub Pages` — публичный хостинг
- `GitHub Actions` — build и deploy
- `NBRB API` — курс валют для калькулятора
- `Google Fonts` — `Manrope`, `Inter`
- `Material Symbols` — иконки

## Команды

```bash
git clone https://github.com/AI-Nikitka93/NemigaTower.git
cd NemigaTower
npm install
npm run serve
```

Локальный адрес по умолчанию: `http://127.0.0.1:41873/`

Дополнительные команды:

```bash
npm run build
npm run serve
npm run test:visual
npm run test:visual:update
```

## Что делает build

- создаёт чистую папку `dist/`
- копирует `index.html`
- находит и копирует только реально используемые ассеты
- создаёт `.nojekyll`
- генерирует `build_metadata.json` с версией, датой сборки и `git_sha`

## Структура проекта

```text
NemigaTower/
├── .github/workflows/pages.yml   # Автодеплой на GitHub Pages
├── assets/                       # Локальные изображения и бренд-ассеты
├── scripts/build.mjs             # Production build для dist
├── tests/visual.spec.js          # Visual regression tests
├── tests/__screenshots__/        # Baseline desktop/mobile снимки
├── index.html                    # Главный UI-файл проекта
├── package.json                  # Скрипты build/serve/test
├── playwright.config.js          # Конфигурация Playwright
├── README.md                     # Русская версия
└── README.en.md                  # Английская версия
```

## Visual Regression

Покрытие включает:

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

Ключевые baselines:

- [home-desktop.png](./tests/__screenshots__/home-desktop.png)
- [home-mobile.png](./tests/__screenshots__/home-mobile.png)
- [infrastructure-mobile.png](./tests/__screenshots__/infrastructure-mobile.png)
- [offices-mobile.png](./tests/__screenshots__/offices-mobile.png)
- [contacts-mobile.png](./tests/__screenshots__/contacts-mobile.png)
- [media-tour-mobile.png](./tests/__screenshots__/media-tour-mobile.png)

## Публичные контакты и служебные данные проекта

- Публичный email на сайте: `rent@nemigatower.by`
- Git email автора в истории репозитория: `nikitka93@example.com`
- Автор: `Nikita (AI_Nikitka93)`

## Ограничения

- это demo-проект, а не сайт реального бизнес-центра
- формы демонстрационные и не отправляют данные на backend
- часть ресурсов загружается из внешних CDN

## Автор

Создано Nikita (AI_Nikitka93)
