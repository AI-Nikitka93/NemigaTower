# PROJECT UNIFIED REPORT: Nemiga Tower

**Дата анализа:** 2026-04-25 20:32
**Аналитик:** P-PROJECT-UNIFIED
**Путь проекта:** `M:\Projects\sites\Biznescentr`
**Режим:** FULL
**Статус полноты анализа:** FULL
**Тип проекта:** статический showcase-лендинг / portfolio demo для вымышленного бизнес-центра
**Уровень зрелости:** WORKING BUT FRAGILE
**Общий verdict:** визуально сильный и в основном рабочий one-page demo surface, но не реальный продукт и не полностью устойчивый runtime.

## 1. HUMAN SUMMARY

- Что это за проект: премиальный одностраничный лендинг "Nemiga Tower" для демонстрации UI/брендинга и front-end craft.
- Какова исходная идея проекта: показать дорогой digital showcase для коммерческой недвижимости в лёгком статическом стеке.
- Для кого он: для портфолио автора, ревьюеров GitHub, потенциальных заказчиков UI/landing work, а не для реальной управляющей компании.
- Какую задачу решает: продаёт образ бизнес-центра, показывает секции инфраструктуры, калькулятор аренды, media tour и контактные формы.
- Как им пользуются: открывают одну HTML-страницу, переходят между секциями через hash navigation, взаимодействуют с калькулятором и модалками.
- Что в нём главное: сильная визуальная упаковка, single-file UI, статическая сборка в `dist/`, визуальные baseline-тесты и GitHub Pages deploy.

## 2. QUICK IDENTITY

- Surface: web / static landing page / portfolio showcase
- Project thesis / intended outcome: продемонстрировать premium corporate UI для fictional Minsk business center без backend-системы
- Основной стек: `HTML` + `Tailwind CSS CDN` + `Vanilla JavaScript` + `Node build script` + `Playwright`
- Основной режим запуска: `npm run build` -> статический `dist/`; локальная подача ожидается через `python -m http.server`
- Главные точки входа: `index.html`, `scripts/build.mjs`, `tests/visual.spec.js`, `.github/workflows/pages.yml`
- На что это похоже по зрелости: polished demo repository, не SaaS и не operational product

## 3. SYSTEM CONTEXT

- Пользователи / акторы: посетитель лендинга, maintainер репозитория, GitHub Pages deploy runner
- Внешние системы: Google Fonts, Tailwind CDN, NBRB exchange-rate API, GitHub Pages, GitHub Actions
- Основные входы: URL hash, клики по nav/CTA, формы, переключатели калькулятора, модалки
- Основные выходы: изменение активной секции, локальный расчёт аренды, toast-сообщения, статический deploy artifact
- Главный результат работы системы: убедительный premium landing experience, а не transaction/backend outcome

## 4. RUNTIME & OPERATION

- Как запускается: `npm run build`; `npm run serve` пытается выполнить `npm run build && python -m http.server 41873 -d dist`
- Команды dev / build / test / run:
  - `npm run build`
  - `npm run serve`
  - `npm run start`
  - `npm run test:visual`
  - `npm run test:visual:update`
- Env / secrets expectations: env-файлы отсутствуют; секреты не ожидаются
- Storage / DB / queues / cron / workers: отсутствуют
- Внешние интеграции:
  - `https://fonts.googleapis.com/...`
  - `https://cdn.tailwindcss.com?plugins=forms,container-queries`
  - `https://api.nbrb.by/exchange/rates?currencycode=840`
- Error handling / recovery path: в JS есть soft fallback для курса валюты; формы не отправляют данные и только показывают toast
- Logging / observability / alerting: специального logging/observability слоя нет; есть только browser console и Playwright screenshots
- CI/CD / deploy path: GitHub Actions собирает `dist/` и публикует в GitHub Pages

## 4A. REPOSITORY SIGNALS

- Git activity / last meaningful commit: `2026-04-06`, `4739ae1`, docs/packaging cleanup после основной продуктовой волны 2026-03-23..2026-03-27
- Contributor pattern: solo
- Tags / releases / versioning: git tags отсутствуют; `package.json` version = `1.0.0`
- Commit hygiene pattern: mixed but readable; сначала feature/build fixes, позже packaging/docs hardening
- Caveat: repo signals показывают аккуратную демонстрационную упаковку, но не доказывают production readiness

## 4B. LIVE PROBE

- Статус: completed
- Что удалось реально запустить:
  - `npm run build` завершился успешно
  - локальный сервер поднят вручную через `py -3 -m http.server 41873 -d dist`
  - локальная страница открыта в in-app browser
- Какие user journeys реально пройдены:
  - home screen
  - переход в `#offices`
  - изменение калькулятора через выбор `Turnkey`
  - открытие `mediaTourModal`
  - отправка контактной формы
- Что реально сработало:
  - hash-based section routing
  - media tour modal
  - calculator recomputation
  - contact form toast flow
- Что сломалось или не ответило:
  - `npm run test:visual` не стартует из-за команды `python` в Windows-среде
  - runtime курс НБ РБ ушёл в fallback `(дефолтный)`; прямой запрос к тому же URL 2026-04-25 вернул `404`
- Какие evidence собраны: screenshots, browser state captures, console logs, shell output

## 5. WHAT THE PROJECT ACTUALLY DOES

### CONFIRMED
- Это статический one-page landing, а не многостраничное приложение и не SaaS backend.
- Вся основная UI-логика и большая часть продукта живут в `index.html`.
- Переключение разделов делается скрытием/показом секций по hash (`#home`, `#offices`, `#contacts` и т.д.), а не отдельными маршрутами.
- Формы `contacts`, `callbackModal`, `bookingModal` не отправляют данные наружу; они вызывают локальные toast-уведомления.
- Есть media tour modal с локальными изображениями и переключением preview.
- Есть rental calculator с площадью, отделкой, этажом, пересчётом в BYN/USD и попыткой подтянуть курс извне.
- Репозиторий реально умеет собирать `dist/` и деплоить его на GitHub Pages.
- Визуальные baseline-тесты и screenshots действительно присутствуют.

### LIKELY
- Проект создавался как portfolio surface, где важнее впечатление, упаковка и QA-артефакты, чем бизнес-операции.
- `stitch/` хранит промежуточные design/code exploration artifacts для эволюции лендинга.
- `WOW_ROADMAP.md` и `IMAGE_PROMPTS.md` отражают реальный creative process, а не только случайные заметки.

### UNCLEAR
- Планировался ли этот репозиторий когда-либо как основа для более реального продукта, или изначально только как showcase.
- Насколько часто визуальные baselines реально поддерживаются после изменений, а не просто однажды были сгенерированы.

### NOT VERIFIED
- GitHub Pages live deployment в момент анализа
- Поведение сайта во внешних браузерах кроме in-app browser
- Любая реальная интеграция с CRM, email, booking backend, analytics, maps, billing

## 6. CORE FLOWS

### User Flow
- Trigger: открытие главной страницы / переход по nav link
- Main path: home -> section nav via hash -> CTA -> модалка или форма
- Modules involved: `index.html` navigation block, `setActiveSection`, `initNavigation`
- Output: смена видимой секции, фокус на `main`, обновлённый hash
- Confidence: CONFIRMED
- Live test status: passed
- Real evidence: локальный runtime открыл `#home`, `#offices`, `#contacts`

### Calculator Flow
- Trigger: изменение площади или выбор отделки/этажа
- Main path: `input`/`click` -> update multipliers -> `calculate()` -> `animateValue()`
- Modules involved: `index.html` calculator controls, `initOptionCards`, `initRangeSlider`, `calculate`
- Output: новый monthly price в BYN и USD
- Confidence: CONFIRMED
- Live test status: passed
- Real evidence: `27 312 BYN` -> `34 134 BYN` после выбора `Turnkey`

### Media Tour Flow
- Trigger: кнопка "Обзор пространства"
- Main path: `openModal('mediaTourModal')` -> hydrate media -> preview + thumbnails -> close
- Modules involved: `index.html` modal markup, `openModal`, `initMediaTour`, deferred media hydration
- Output: modal overlay с preview и gallery-like chooser
- Confidence: CONFIRMED
- Live test status: passed
- Real evidence: modal открылся, heading = `Архитектурный фасад`

### Contact / Lead Capture Flow
- Trigger: submit в contact form или modal forms
- Main path: `handleSubmit` / `handleModalSubmit`
- Modules involved: `index.html` form markup, toast container, submit handlers
- Output: toast and form reset only
- Confidence: CONFIRMED
- Live test status: passed
- Real evidence: toast `Заявка отправлена...`

### Delivery / Publishing Flow
- Trigger: push в `main`
- Main path: GitHub Actions -> `npm ci` -> `npm run build` -> upload Pages artifact -> deploy
- Modules involved: `.github/workflows/pages.yml`, `scripts/build.mjs`
- Output: статический GitHub Pages site
- Confidence: LIKELY
- Live test status: not_run
- Real evidence: workflow config и build artifact подтверждены локально, сам remote deploy не проверялся

## 7. FEATURE MAP

| Функция / capability | Статус | Evidence |
|---|---|---|
| Hero / premium landing presentation | confirmed | `index.html`, runtime screenshots |
| Hash-based section navigation | confirmed | live probe `#home/#offices/#contacts` |
| Responsive mobile layout | confirmed | Playwright mobile baselines + viewed screenshots |
| Rental calculator | confirmed | `calculate()` + live recomputation |
| Live FX rate from NBRB | working_but_degraded | код есть, но live probe 2026-04-25 ушёл в default fallback; direct request returned 404 |
| Media tour modal | confirmed | runtime modal screenshot |
| Gallery filtering | likely | `initGalleryFilters()` and gallery filter buttons; вручную не кликалось |
| Contact / callback / booking forms | confirmed_as_demo | submit handlers only show toast; no backend |
| Accessibility basics | confirmed | skip-link, focus states, aria labels, focus trap logic |
| Visual regression suite | confirmed | `tests/visual.spec.js` + baseline files exist |
| Visual suite runnable cross-platform | not_verified | failed in current Windows environment because `python` command missing |
| Production-grade backend / persistence | not_verified | absent from codebase |

## 8. ARCHITECTURE MAP

| Область / модуль | Что делает | Ключевые файлы | Notes |
|---|---|---|---|
| UI shell | Весь markup, styles, scripts, copy, UX flows | `index.html` | Current truth проекта |
| Static build | Копирует `index.html`, referenced assets, пишет metadata | `scripts/build.mjs` | Build intentionally minimal |
| Visual QA | Снимки desktop/mobile для ключевых состояний | `tests/visual.spec.js`, `tests/__screenshots__/` | No unit/integration tests beyond visuals |
| Deploy pipeline | GitHub Pages artifact build and deploy | `.github/workflows/pages.yml` | Clean static delivery path |
| Repo governance | contribution/support/security/community profile | `README.md`, `README.ru.md`, `CONTRIBUTING.md`, `SUPPORT.md`, `SECURITY.md`, `.github/*` | Strong repo packaging |
| Design exploration | design-system intent and earlier screen/code iterations | `stitch/nemiga_tower/DESIGN.md`, `stitch/v3_*/*`, `prd_v2.0.html`, `WOW_ROADMAP.md`, `IMAGE_PROMPTS.md` | Useful for intent, not runtime |

## 9. CURRENT VS LEGACY

### Current / Primary Path
- `index.html` -> `scripts/build.mjs` -> `dist/` -> GitHub Pages

### Secondary / Fallback Path
- Browser fallback for FX rate uses default `usdRate = 3.25` when API load fails

### Legacy / Historical Path
- `stitch/v3_*` and `prd_v2.0.html` look like earlier ideation / generated variants
- `.codex_restore/index.html.pre_p00_20260327.bak` is backup noise, not current truth

## 10. VISUAL & DESIGN STATE

- Есть ли реальный UI / визуальный слой: да
- Есть ли единый стиль: да, consistent dark + gold neo-corporate palette
- Есть ли брендинг: да, `NT / Nemiga Tower` wordmark, fixed palette, premium copy tone
- Есть ли продуктовая упаковка: да, README, screenshots, support/security/contributing surfaces оформлены сильно
- Responsive / mobile readiness: есть явные mobile media rules и mobile screenshots
- Accessibility signals: skip link, `aria-label`, `aria-live`, modal focus trap, reduced-motion handling, keyboard close on `Escape`
- i18n / l10n state: runtime UI только на русском; репозиторная документация bilingual (`README.md`, `README.ru.md`)
- Какие экраны / ассеты реально изучены: home desktop/mobile, contacts mobile, media tour modal, docs screenshot, assets inventory
- Есть ли screenshots / runtime captures как evidence: да

### Сильные стороны визуального слоя
- Визуальная идентичность цельная и выдержанная
- Hero, statistics, bento cards и modal presentation выглядят профессионально
- Mobile layout не выглядит случайно сломанным
- Brand mark и dark/gold system consistently carried through page and repo assets

### Слабые места визуального слоя
- Половина "продукта" держится на искусственно curated контенте без real-data depth
- Runtime по-прежнему зависит от Tailwind CDN и Google Fonts
- Крупные JPG/PNG assets тяжёлые: папка `assets/` суммарно около `19.6 MB`

### Что не удалось подтвердить по дизайну
- Поведение всех секций и фильтров в реальных внешних браузерах
- Accessibility quality beyond the visible basics (например, screen-reader walkthrough)

## 11. DIRECTORY COVERAGE

| Папка / зона | Статус | Что найдено | Насколько важно |
|---|---|---|---|
| `/` | reviewed | `index.html`, manifests, docs, screenshots, build/test config | high |
| `.github/` | reviewed | Pages workflow, issue templates, CODEOWNERS, PR template | medium |
| `assets/` | reviewed | 22 images/logo assets, mostly large showcase media | high |
| `scripts/` | reviewed | one build script | high |
| `tests/` | reviewed | Playwright visual suite + baselines | high |
| `dist/` | reviewed | built static output and metadata | medium |
| `docs/` | reviewed | screenshots only before this report | medium |
| `stitch/` | partial | design artifacts and earlier variants | medium |
| `.audit_mobile/` | partial | additional audit screenshots | low |
| `.audit_visual/` | partial | additional visual sheets | low |
| `.codex_restore/` | partial | backup artifact | low |
| `node_modules/` | skipped | installed dependencies | low |
| `test-results/` | skipped | generated output | low |

## 12. FILES THAT DEFINE THE PROJECT

| Файл | Роль | Почему важен |
|---|---|---|
| `index.html` | основной UI, content, runtime logic | центр всей системы |
| `package.json` | manifest/scripts | определяет build/serve/test contract |
| `scripts/build.mjs` | static build pipeline | показывает, как реально формируется `dist/` |
| `playwright.config.js` | visual QA runtime | задаёт локальный server contract и projects |
| `tests/visual.spec.js` | ключевой automated verification layer | показывает, какие экраны считаются критичными |
| `.github/workflows/pages.yml` | deploy pipeline | подтверждает delivery model |
| `README.md` | public repo framing | помогает понять intended surface, но не заменяет code truth |
| `README.ru.md` | RU mirror of repo framing | показывает dual-language packaging discipline |
| `stitch/nemiga_tower/DESIGN.md` | design intent | помогает понять product/visual thesis |
| `prd_v2.0.html` | early architecture/product brief | показывает исходную концепцию и calculator intent |

## 13. CURRENT STATE ASSESSMENT

### Что уже выглядит зрелым
- Визуальная упаковка landing page
- Статическая сборка и deploy path
- Repo governance/documentation surface
- Базовая responsive and accessibility discipline
- Наличие visual baselines вместо полного отсутствия QA

### Что выглядит хрупким
- Весь runtime собран в одном `index.html`
- `npm run serve` и `npm run test:visual` зависят от команды `python`, что ломает Windows setup без alias
- FX rate integration использует URL, который на 2026-04-25 дал `404`, поэтому "live rate" деградирует в дефолт
- Tailwind через CDN вызывает production warning прямо в console

### Что выглядит сырым или недоделанным
- Нет реальной data/backend layer behind forms or booking
- Новости, отзывы, occupancy-like numbers выглядят curated/demo, а не доказанно data-backed
- Нет observability/analytics/monitoring beyond screenshots and console

### Главные неизвестности
- Реально ли live deploy соответствует локальной сборке сейчас
- Насколько устойчивы visual baselines после будущих изменений
- Планируется ли эволюция из showcase в более модульный front-end

## 14. PRODUCT MATURITY ASSESSMENT

- Техническая зрелость: средняя для static demo, низкая для реального product surface
- Функциональная зрелость: demo-complete, but shallow; core flows mostly presentation-only
- Визуальная зрелость: высокая
- Операционная зрелость: умеренная; есть deploy и docs, но нет robust runtime/monitoring
- Process / delivery maturity: неплохая для solo portfolio repo
- Почему выбран именно этот уровень зрелости: проект уже даёт реальный polished user-facing result, но важные части либо декоративны, либо хрупки, а runtime не дотягивает до truly productized stability

## 15. GROWTH AREAS

| Зона | Что можно улучшить или добавить | Почему это важно |
|---|---|---|
| PRJ-001 Runtime portability | заменить `python` на более cross-platform launch contract (`py`, node static server, or script detection) | текущие тесты и serve ломаются в Windows окружении |
| PRJ-002 FX rate integration | починить или обновить endpoint NBRB API и явно обрабатывать non-200 responses | сейчас одна из немногих "живых" интеграций не подтверждается |
| PRJ-003 Asset performance | оптимизировать изображения и убрать лишние дубликаты в `assets/` | уменьшит payload и снизит декоративный шум |
| PRJ-004 Build maturity | уйти с Tailwind CDN на prebuilt CSS | консоль уже предупреждает, что текущий путь не production-grade |
| PRJ-005 Front-end maintainability | вынести JS/CSS из монолитного `index.html` | current truth понятен, но плохо масштабируется |
| PRJ-006 Trust surface | явно маркировать demo-only numbers/news/testimonials внутри UX или docs | уменьшит разрыв между впечатлением и фактической системой |

## 16. CONFIDENCE & VERIFICATION LAYER

### Verified Facts
- `npm run build` завершился успешно 2026-04-25
- локальный сайт открылся и показал home/offices/contacts/media-tour flows
- calculator recomputes values when options change
- forms are demo-only and show toast instead of backend submission
- `npm run test:visual` не стартует в текущем Windows runtime из-за `python` command
- request to configured NBRB endpoint returned `404` on 2026-04-25

### Strong Inferences
- Проект целился в premium portfolio presentation, а не в business operations system
- `stitch/` и related docs represent design evolution rather than shipping runtime
- Visual maturity intentionally outweighs functional depth

### Open Unknowns
- Remote GitHub Pages state right now
- Full accessibility quality under assistive tech
- Long-term maintainability if project grows beyond one landing page

### Blockers to Confirmation
- PRJ-001: локальные visual tests в текущем Windows runtime не поднимают web server штатно
- PRJ-002: live FX-rate path cannot be confirmed because configured API URL currently fails

## 17. FINAL VERDICT

- Это уже готовый продукт или нет: нет, если оценивать как реальный продукт бизнес-центра; да, частично, если оценивать как portfolio showcase repository
- Что мешает считать его готовым продуктом:
  - отсутствие реального backend/lead pipeline
  - декоративный характер новостей/отзывов/статусов
  - сломанный live rate endpoint
  - хрупкость launch/test path в Windows
  - монолитность `index.html`
- Что уже можно считать сильной стороной проекта:
  - убедительный visual layer
  - аккуратный static delivery path
  - хорошие repository packaging signals
  - рабочие demo flows, достаточные для portfolio review
- Где главный потенциал роста:
  - перевести demo polish в более устойчивый runtime
  - убрать fragile dependencies
  - отделить presentation surface от operational truth
