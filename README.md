# Nemiga Tower

Премиальный showcase-лендинг бизнес-центра для портфолио. Проект собран как одностраничный сайт с акцентом на визуальный polish, адаптивность, доступность и стабильный GitHub Pages деплой.

[Live URL](https://ai-nikitka93.github.io/NemigaTower/)  
[Repository](https://github.com/AI-Nikitka93/NemigaTower/)

## Что внутри

- Премиальный dark/gold visual language с glassmorphism и bento-layout
- Навигация по секциям без перезагрузки страницы
- Калькулятор аренды с live-пересчётом и курсом НБ РБ
- Доступные модалки, `skip-link`, `focus-visible`, `prefers-reduced-motion`
- Адаптивные mobile layouts для ключевых секций
- Visual regression suite на Playwright для desktop и mobile экранов
- Автоматический GitHub Pages deploy через Actions

## Стек

- `HTML5`
- `Tailwind CSS CDN`
- `Vanilla JavaScript`
- `Playwright`
- `GitHub Pages`

## Локальный запуск

```bash
git clone https://github.com/AI-Nikitka93/NemigaTower.git
cd NemigaTower
npm install
npm run serve
```

Локальный адрес по умолчанию: `http://127.0.0.1:41873/`

## Команды

```bash
npm run build
npm run serve
npm run test:visual
npm run test:visual:update
```

Что делает `build`:

- создаёт чистую папку `dist/`
- копирует `index.html`
- находит и копирует только реально используемые ассеты
- создаёт `.nojekyll`
- генерирует `build_metadata.json` с версией, датой сборки и `git_sha`

## Структура проекта

```text
NemigaTower/
├── .github/workflows/pages.yml   # Автодеплой на GitHub Pages
├── assets/                       # Исходные изображения и бренд-ассеты
├── scripts/build.mjs             # Production build для dist
├── tests/visual.spec.js          # Visual regression tests
├── tests/__screenshots__/        # Базовые desktop/mobile снимки
├── index.html                    # Главный UI-файл проекта
├── package.json                  # Скрипты build/serve/test
├── playwright.config.js          # Конфигурация Playwright
└── README.md
```

## Ключевые секции

- `Главная` — hero, метрики, преимущества
- `Инфраструктура` — ресторан, фитнес, коворкинг, паркинг
- `Офисы` — калькулятор аренды
- `Галерея` — брендовые визуалы
- `Новости` и `Отзывы`
- `Контакты` — формы и контактный блок

## Тестовое покрытие

Visual regression проверяет:

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

## Deploy

Проект публикуется на GitHub Pages по пушу в `main`.

Workflow:

1. `npm ci`
2. `npm run build`
3. upload `dist/`
4. deploy в Pages environment

Итоговый URL:

`https://ai-nikitka93.github.io/NemigaTower/`

## Ограничения проекта

- Это демо-проект, а не сайт реального бизнес-центра
- Формы сейчас демонстрационные и не отправляют данные на backend
- Tailwind и шрифты загружаются из внешних CDN

## Автор

Создано Nikita (AI_Nikitka93)
