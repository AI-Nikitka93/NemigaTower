# PROJECT UNIFIED REPORT: Nemiga Tower

**Дата анализа:** 2026-05-02 19:15 +03:00  
**Аналитик:** P-PROJECT-UNIFIED  
**Путь проекта:** `M:\Projects\sites\Biznescentr`  
**Режим:** FULL  
**Статус полноты анализа:** FULL  
**Тип проекта:** WEB / static portfolio showcase  
**Уровень зрелости:** NEARLY PRODUCTIZED  
**Общий verdict:** проект близок к завершённой портфолио-витрине и уже доказуемо собирается, открывается, проходит visual-регрессию и показывает основные интерактивные сценарии. Это не готовый коммерческий сайт реального бизнес-центра: заявки демо-only, backend/CRM/аналитики/операционного слоя нет, тяжёлые изображения и CDN-зависимости ещё ограничивают production-like claim.

**Supersedes:** `docs/audit/reports/2026-04-25_2032_p-project-unified.md`  
**Compared with previous report:** старые blockers по Python-зависимости локального запуска и сломанному NBRB endpoint исправлены и перепроверены 2026-05-02.  
**Delta summary:** maturity повышен с `WORKING BUT FRAGILE` до `NEARLY PRODUCTIZED` для заявленной identity портфолио-витрины.

## 0. PRE-FLIGHT

- Входной контекст: локальная папка проекта `M:\Projects\sites\Biznescentr` и запрос на полный unified-анализ.
- Что реально доступно: исходники, README, package/scripts, Playwright tests, assets, Git metadata, GitHub Pages workflow, старые и новые audit reports, локальный browser/runtime.
- Что недоступно: secrets не требуются; GitHub Actions run history не инспектировалась через GitHub API/connector; production telemetry отсутствует.
- Локальные context-файлы: `AGENTS.md`, `docs/STATE.md`, `docs/EXEC_PLAN.md`, `docs/PROJECT_HISTORY.md`, `docs/DECISIONS.md` не найдены.
- TODO / TASKS / NEXT / PLAN: активный TODO-файл не найден, поэтому TODO writeback не создавался.

## 1. HUMAN SUMMARY

- Что это за проект: одностраничный премиальный showcase-сайт для вымышленного бизнес-центра `Nemiga Tower` в Минске.
- Какова исходная идея проекта: показать, что автор может за короткое время с помощью ИИ собрать визуально сильный, интерактивный сайт-витрину с упаковкой под публичный репозиторий.
- Для кого он: для портфолио автора, потенциальных работодателей/клиентов и следующего AI-агента, который должен понять уровень UI/проектной упаковки.
- Какую задачу решает: демонстрирует premium landing, навигацию по секциям, калькулятор аренды, gallery/media tour, контактные формы и статическую поставку через GitHub Pages.
- Как им пользуются: открыть публичную страницу или локально выполнить `npm run build`, затем `npm run serve`; пользователь кликает секции, считает аренду, открывает обзор пространства и отправляет демо-заявку.
- Что в нём главное: цельный визуальный showcase, а не настоящая операционная система аренды офисов.

## 2. QUICK IDENTITY

- Surface: WEB / landing / portfolio showcase.
- Project thesis / intended outcome: показать polished AI-assisted website за вечер, без завышения до реального SaaS или production commerce.
- Основной стек: `HTML`, `Tailwind CDN`, vanilla `JavaScript`, static assets, Node build/serve scripts, `Playwright`.
- Основной режим запуска: build static `dist`, затем локальный Node static server или GitHub Pages.
- Главные точки входа: `index.html`, `scripts/build.mjs`, `scripts/serve.mjs`, `tests/visual.spec.js`, `.github/workflows/pages.yml`.
- На что это похоже по зрелости: почти завершённый portfolio case с измерениями и визуальной регрессией, но без backend-продуктовости.

## 3. SYSTEM CONTEXT

- Пользователи / акторы: посетитель сайта, автор портфолио, reviewer/работодатель, GitHub Pages как delivery target.
- Внешние системы: NBRB API для курса USD, Google Fonts, Material Symbols, Tailwind CDN, GitHub Pages.
- Основные входы: действия пользователя в навигации, range slider калькулятора, option cards, формы, media-tour clicks.
- Основные выходы: рассчитанная стоимость аренды, toast-сообщения, модальные окна, визуальный tour, статический `dist`.
- Главный результат работы системы: пользователь видит убедительную интерактивную витрину объекта, а reviewer видит репозиторий с понятной сборкой и тестами.

## 4. RUNTIME & OPERATION

- Как запускается: `npm run build`, затем `npm run serve`.
- Команды dev / build / test / run:
  - `npm run build` — копирует `index.html` и реально упомянутые assets в `dist`.
  - `npm run serve` — собирает `dist` и отдаёт его через `scripts/serve.mjs`.
  - `npm run test:visual` — запускает visual suite Playwright по desktop/mobile baseline.
- Env / secrets expectations: секреты не требуются.
- Storage / DB / queues / cron / workers: отсутствуют.
- Внешние интеграции: `https://api.nbrb.by/exrates/rates/USD?parammode=2` для курса USD; CDN для Tailwind, Google Fonts и Material Symbols.
- Error handling / recovery path: NBRB fetch проверяет `response.ok`, при ошибке оставляет fallback курс и пересчитывает калькулятор.
- Logging / observability / alerting: production telemetry отсутствует; для portfolio showcase это не blocker, для настоящего сайта объекта было бы gap.
- CI/CD / deploy path: `.github/workflows/pages.yml` публикует `dist` в GitHub Pages.

## 4A. REPOSITORY SIGNALS

- Git activity / last meaningful commit: есть свежая серия коммитов по docs, packaging, performance и site fixes; текущая рабочая копия содержит незакоммиченные audit/fix изменения.
- Contributor pattern: solo.
- Tags / releases / versioning: tags не обнаружены.
- Commit hygiene pattern: mixed but understandable; последние коммиты выглядят тематическими.
- Remote: `https://github.com/AI-Nikitka93/NemigaTower.git`.
- Current branch: `main`.
- Caveat: repo signals помогают понять зрелость процесса, но не доказывают рабочий продукт.

## 4B. LIVE PROBE

- Статус: completed.
- Что удалось реально запустить: `npm run build`, `npm run test:visual`, локальный static server на `http://127.0.0.1:41912/`.
- Какие user journeys реально пройдены:
  - главная страница;
  - калькулятор аренды в `#offices`;
  - модалка бронирования;
  - отправка demo booking;
  - отправка demo contact request;
  - media tour;
  - mobile menu.
- Что реально сработало:
  - build: `Built dist with 8 referenced assets`;
  - visual suite: `10 passed`, `10 skipped`;
  - NBRB live rate in browser: `2.8230`, `от 02.05`;
  - calculator after interaction: `360 м²`, `49 163 BYN`, `17 415 USD`;
  - booking modal inherited calculated area/price and email field rendered dark;
  - form submissions produced toast messages and reset fields;
  - media tour switched to `Фитнес-клуб`;
  - mobile menu opened with `aria-expanded="true"`.
- Что сломалось или не ответило: в текущем live probe console errors не обнаружены.
- Какие evidence собраны:
  - `output/playwright/p-project-unified-2026-05-02_1912/probe-result.json`;
  - screenshots: `home-desktop.png`, `offices-calculator-desktop.png`, `booking-modal-desktop.png`, `contacts-submit-desktop.png`, `media-tour-desktop.png`, `mobile-menu.png`;
  - public Pages check: `https://ai-nikitka93.github.io/NemigaTower/` returned HTTP `200`, content contains `Nemiga Tower`.

## 5. WHAT THE PROJECT ACTUALLY DOES

### CONFIRMED

- Собирает статический сайт в `dist` через Node script.
- Локально отдаёт `dist` без Python-зависимости.
- Открывает основной UI в browser.
- Переключает основные секции сайта через hash/navigation.
- Загружает live USD rate из NBRB API и пересчитывает аренду.
- Даёт demo booking/contact формы с toast outcome без отправки на backend.
- Показывает gallery/media tour и переключает карточки тура.
- Проходит visual regression suite на desktop/mobile baseline.
- Публичная GitHub Pages страница отвечает HTTP `200`.

### LIKELY

- Проект рассчитан на portfolio/employer-facing упаковку, а не на обслуживание реальных лидов.
- Визуальный стиль намеренно premium/dark/gold и ориентирован на эффектную демонстрацию.
- GitHub Pages workflow достаточен для текущей статической модели.

### UNCLEAR

- Нет явного product brief внутри repo, кроме README и footer/microcopy; исходный замысел реконструируется по коду, docs и пользовательскому контексту.
- Нет доказанного процесса регулярной визуальной регрессии в CI после текущих локальных изменений.

### NOT VERIFIED

- Реальная отправка лидов в CRM/email.
- Production analytics, business monitoring, A/B testing.
- Полная cross-browser матрица вне Playwright Chromium.
- Долгосрочная устойчивость внешних CDN и NBRB API.

## 6. CORE FLOWS

### User Flow

- Trigger: пользователь открывает сайт.
- Main path: `home` -> navigation -> `offices` / `gallery` / `contacts`.
- Modules involved: `index.html`, `setActiveSection`, `initNavigation`, sections markup.
- Output: активная секция и видимый контент.
- Confidence: CONFIRMED.
- Live test status: passed.
- Real evidence: `home-desktop.png`, `mobile-menu.png`, live probe JSON.

### Rental Calculator Flow

- Trigger: пользователь открывает `#offices`, меняет площадь/отделку/этаж.
- Main path: `loadExchangeRate` -> `calculate` -> DOM update.
- Modules involved: `index.html`, NBRB fetch, `areaSlider`, `.option-card`.
- Output: BYN/USD price, area, coefficients.
- Confidence: CONFIRMED.
- Live test status: passed.
- Real evidence: browser showed `2.8230`, `360 м²`, `49 163 BYN`, `17 415 USD`.

### Booking / Contact Flow

- Trigger: пользователь открывает booking modal или отправляет contact form.
- Main path: `openModal` -> `handleModalSubmit` / `handleSubmit` -> toast -> form reset.
- Modules involved: `bookingModal`, `contacts` form, `showToast`.
- Output: local toast confirmation; no network side effect.
- Confidence: CONFIRMED for demo UI behavior, NOT VERIFIED for real lead delivery.
- Live test status: passed for demo outcome.
- Real evidence: `booking-modal-desktop.png`, `contacts-submit-desktop.png`.

### Media Tour Flow

- Trigger: пользователь открывает media tour and clicks tour card.
- Main path: `openModal('mediaTourModal')` -> `initMediaTour` card handler -> preview/text update.
- Modules involved: `mediaTourModal`, `hydrateMediaWithin`, `initMediaTour`.
- Output: updated preview and description.
- Confidence: CONFIRMED.
- Live test status: passed.
- Real evidence: media heading switched to `Фитнес-клуб`.

### Delivery / Publishing Flow

- Trigger: push to GitHub branch configured for Pages.
- Main path: workflow installs deps, runs build, uploads static artifact.
- Modules involved: `.github/workflows/pages.yml`, `scripts/build.mjs`, `dist`.
- Output: published static site.
- Confidence: SUPPORTED_BY_CODE plus external endpoint observed.
- Live test status: partial.
- Real evidence: public URL HTTP `200`; workflow execution status was not inspected.

## 7. FEATURE MAP

| Функция / capability | Статус | Evidence |
|---|---|---|
| Premium landing sections | confirmed | browser screenshots, `index.html` |
| Hash navigation | confirmed | live probe, `initNavigation` |
| Rental calculator | confirmed | live probe with NBRB rate and computed prices |
| NBRB USD exchange rate | confirmed | browser live rate `2.8230`, code endpoint |
| Booking modal | confirmed for demo | live probe, no backend delivery |
| Contact form | confirmed for demo | live probe, no backend delivery |
| Media tour modal | confirmed | live probe and screenshot |
| Gallery filters | supported by code | `initGalleryFilters`, not separately clicked in unified probe |
| Mobile menu | confirmed | live probe with ARIA state |
| Static build | confirmed | `npm run build` |
| Static local serve | confirmed | local server probe |
| Visual regression tests | confirmed | `npm run test:visual` |
| GitHub Pages publishing | partial | workflow code plus public URL HTTP `200`; CI run not inspected |
| Real CRM/email lead delivery | not_verified | no backend/API integration present |
| Analytics/reporting | not_verified | no telemetry integration found |

## 8. ARCHITECTURE MAP

| Область / модуль | Что делает | Ключевые файлы | Notes |
|---|---|---|---|
| Page shell / UI | Вся разметка, стили и интерактивность сайта | `index.html` | Single-file app; удобно для demo, но масштабирование ограничено |
| Static build | Создаёт `dist` и копирует referenced assets | `scripts/build.mjs` | Проверяет наличие assets, пишет `build_metadata.json` |
| Local server | Отдаёт `dist`, fallback на `index.html`, cache headers | `scripts/serve.mjs` | Устраняет Windows/Python fragility |
| Visual tests | Desktop/mobile screenshot regression | `tests/visual.spec.js`, `tests/__screenshots__/*` | NBRB mocked for deterministic screenshots |
| Public deploy | GitHub Pages artifact workflow | `.github/workflows/pages.yml` | Static-only deploy |
| Documentation | Public packaging and bilingual description | `README.md`, `README.ru.md` | Честнее после правок: Node serve, demo framing |
| Assets | Hero, logo, gallery, screenshots | `assets/*`, `docs/screenshots/*` | Главный perf-risk: тяжёлые images |
| Audit trail | Specialist and unified reports | `docs/audit/reports/*`, `docs/audit/audit_log.jsonl` | Теперь содержит evidence history |

## 9. CURRENT VS LEGACY

### Current / Primary Path

- `npm run build` -> `dist` -> `scripts/serve.mjs` locally или GitHub Pages.
- `index.html` остаётся source of truth для UI, logic и copy.
- `tests/visual.spec.js` защищает ключевые экраны.

### Secondary / Fallback Path

- NBRB API failure falls back to default rate and marks rate as default.
- SPA-like hash fallback in server returns `index.html`.

### Legacy / Historical Path

- Старый Python-based serve path удалён из current scripts/docs.
- Старый NBRB endpoint был dead и заменён.
- Старый visual issue с белым input в modal исправлен.

## 10. VISUAL & DESIGN STATE

- Есть ли реальный UI / визуальный слой: да, полноценная one-page showcase interface.
- Есть ли единый стиль: да, тёмная premium-палитра, золото, glass surfaces, крупная типографика.
- Есть ли брендинг: да, `Nemiga Tower` wordmark/logo, luxury business center tone.
- Есть ли продуктовая упаковка: да для portfolio showcase; нет для реального коммерческого объекта.
- Responsive / mobile readiness: подтверждена visual suite и live mobile menu probe.
- Accessibility signals: есть `aria-label`, `aria-hidden`, `aria-expanded`, modal focus guard, Escape handling, reduced-motion checks.
- i18n / l10n state: UI на русском; separate English README exists; runtime locale switching отсутствует.
- Какие экраны / ассеты реально изучены: home, offices calculator, booking modal, contacts submit, media tour, mobile menu, assets inventory.
- Есть ли screenshots / runtime captures как evidence: да, `output/playwright/p-project-unified-2026-05-02_1912/*`.

### Сильные стороны визуального слоя

- Первый экран и premium tone выглядят как цельный showcase, а не как случайный набор блоков.
- Есть desktop/mobile визуальная регрессия.
- После ремонта modal fields и mobile hero больше не выглядят как очевидные visual blockers.

### Слабые места визуального слоя

- Asset payload тяжёлый: несколько JPEG/PNG примерно 0.8-2.1 MB, что мешает production-like performance.
- Большой single-file UI усложняет будущий системный дизайн и component reuse.
- Тёмно-золотая палитра сильная, но почти вся identity держится на одном визуальном тоне.

### Что не удалось подтвердить по дизайну

- Полная WCAG-аудитория/контрастная сертификация не проводилась.
- Cross-browser visual parity вне текущего Playwright Chromium не проверялась.

## 11. DIRECTORY COVERAGE

| Папка / зона | Статус | Что найдено | Насколько важно |
|---|---|---|---|
| root | reviewed | README, package, workflow-related files | high |
| `assets` | reviewed | logo, hero, gallery, service images | high |
| `scripts` | reviewed | build and serve scripts | high |
| `tests` | reviewed | Playwright visual suite and baselines | high |
| `.github/workflows` | reviewed | GitHub Pages deploy workflow | medium |
| `docs/audit` | reviewed | specialist reports and audit log | high |
| `docs/screenshots` | partial | public screenshot artifacts | medium |
| `dist` | generated | build output | medium |
| `output` | generated | audit screenshots and perf JSON | medium |
| `node_modules` | skipped | dependency install output | low |

## 12. FILES THAT DEFINE THE PROJECT

| Файл | Роль | Почему важен |
|---|---|---|
| `index.html` | Core app | Единственный source of truth для UI, copy, styles и interactive behavior |
| `package.json` | Script contract | Определяет build/serve/test commands |
| `scripts/build.mjs` | Static build | Гарантирует, что `dist` содержит только referenced assets и metadata |
| `scripts/serve.mjs` | Local runtime | Делает локальный запуск переносимым на Windows без Python |
| `tests/visual.spec.js` | Visual evidence | Фиксирует ключевые desktop/mobile экраны и стабилизирует NBRB для screenshots |
| `tests/__screenshots__/home-mobile.png` | Mobile baseline | Доказательство обновлённого mobile hero baseline |
| `.github/workflows/pages.yml` | Deploy path | Публикует static artifact в GitHub Pages |
| `README.md` | Public framing | Объясняет проект для GitHub/reviewer audience |
| `README.ru.md` | Russian public framing | Русская версия упаковки проекта |
| `docs/audit/audit_log.jsonl` | Audit memory | Хранит actionable findings/status events |

## 13. CURRENT STATE ASSESSMENT

### Что уже выглядит зрелым

- Статический build path доказан.
- Локальный запуск переносимее, чем раньше.
- Основные interactive flows работают в браузере.
- Visual regression suite закрывает representative screens.
- Публичная GitHub Pages поверхность отвечает.
- Documentation и README bilingual packaging уже на уровне портфолио.

### Что выглядит хрупким

- Вся app-логика и UI живут в одном `index.html`.
- Runtime зависит от CDN Tailwind/fonts/material icons.
- NBRB endpoint внешний; fallback есть, но business truth зависит от сети.
- Heavy assets снижают запас по публичной производительности.

### Что выглядит сырым или недоделанным

- Формы не отправляют данные наружу.
- Нет analytics/observability.
- Нет настоящей content/admin модели.
- Нет полноценной i18n runtime support.

### Главные неизвестности

- Проверенный статус последнего GitHub Actions run не снимался.
- Реальная cross-browser матрица не проверялась.
- Нет evidence, что публичная Pages версия уже содержит все текущие локальные исправления.

## 14. PRODUCT MATURITY ASSESSMENT

- Техническая зрелость: хорошая для static showcase; ограниченная для масштабируемого web product.
- Функциональная зрелость: основные демонстрационные сценарии подтверждены; real lead delivery отсутствует.
- Визуальная зрелость: выше среднего для portfolio case, с сохранёнными performance/asset рисками.
- Операционная зрелость: достаточная для GitHub Pages showcase; недостаточная для реального business site.
- Process / delivery maturity: есть scripts, visual tests, audit reports, workflow; tags/releases нет.
- Почему выбран именно этот уровень зрелости: после исправлений проект уже не выглядит как сырой прототип и не держится на непроверенных claims, но ещё не является `PRODUCTIZED`, потому что production-like слои отсутствуют и часть public delivery truth остаётся partial.

## 15. GROWTH AREAS

| Зона | Что можно улучшить или добавить | Почему это важно |
|---|---|---|
| Images | WebP/AVIF/responsive image pipeline | Снизит вес страницы и усилит perf claim |
| CDN dependency | Перейти с Tailwind CDN к compiled CSS | Уменьшит внешний render-path риск |
| Public delivery proof | Зафиксировать latest Pages deployment evidence | Уберёт разрыв между local truth и public truth |
| Demo forms | Явно маркировать demo-only outcome или добавить реальный endpoint | Не будет иллюзии CRM-функции |
| Component structure | Вынести UI/logic из single-file при дальнейшем росте | Упростит поддержку, если проект перестанет быть one-evening showcase |
| Accessibility | Провести focused contrast/keyboard pass | Усилит доверие к polished UI |

## 16. CONFIDENCE & VERIFICATION LAYER

### Verified Facts

- `npm run build` успешно выполнен 2026-05-02.
- `npm run test:visual` успешно выполнен 2026-05-02: `10 passed`, `10 skipped`.
- Локальный browser probe прошёл основные flows без console errors.
- NBRB live rate был получен в браузере: `2.8230`, дата `02.05`.
- Public Pages URL вернул HTTP `200`.
- Старые blockers `PRJ-001` и `PRJ-002` исправлены на уровне локальной перепроверки.

### Strong Inferences

- Проект предназначен прежде всего для portfolio/demo evaluation, а не для реального операционного сайта.
- Визуальная упаковка является главным value surface.
- Одностраничная архитектура выбрана ради скорости и демонстрации, а не долгого масштабирования.

### Open Unknowns

- Проверенный статус GitHub Actions run после текущих локальных изменений.
- Полное соответствие public Pages версии текущему локальному состоянию.
- Cross-browser parity вне Chromium.
- Долгосрочная стабильность внешних CDN и NBRB API.

### Blockers to Confirmation

- Нет production backend для заявок, поэтому real lead capture cannot be confirmed.
- Нет telemetry, поэтому real-user reliability/performance после публикации не подтверждаются.
- Нет deployment run inspection, поэтому CI/CD truth подтверждён только частично.

## 17. FINAL VERDICT

- Это уже готовый продукт или нет: `NEARLY PRODUCTIZED` как портфолио-витрина; не `PRODUCTIZED` как настоящий сайт коммерческого объекта.
- Что мешает считать его готовым продуктом: demo-only forms, отсутствие backend/CRM/analytics/telemetry, тяжёлые assets, CDN-зависимости и неполностью доказанная latest public deployment parity.
- Что уже можно считать сильной стороной проекта: цельный визуальный showcase с реальными интерактивными flows, локальной сборкой, Node serve path, visual regression и публичной Pages surface.
- Где главный потенциал роста: упаковать static demo в ещё более доказуемый portfolio artifact: оптимизировать images/CSS, зафиксировать public deployment proof и держать copy честной относительно demo-only функций.

## 18. REPAIRS DURING THE ANALYSIS SEQUENCE

- Было найдено: сломанный NBRB endpoint, Windows-fragile Python serve contract, misleading demo copy, белое поле email в booking modal, слишком tight mobile hero line-height, слабые static delivery hints.
- Что исправлено во время анализа: NBRB endpoint, Node static server, README/package serve contract, demo toast copy, modal field specificity, mobile hero override, image preload/dimensions, cache headers, visual baseline.
- Что после исправления перепроверено: build, visual tests, browser smoke, visual screenshots, perf measurements, local live probe.
- Что всё ещё осталось неисправным или непроверенным: heavy image payload, CDN dependency, mobile CLS close to threshold, latest GitHub Actions run, public parity with current local changes.
