/**
 * AURA Nemiga Tower — Core Interactive Layer
 * Optimized for performance and WOW effect.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sections = Array.from(document.querySelectorAll('.section'));
const navLinks = Array.from(document.querySelectorAll('.js-nav-link'));
const desktopNavLinks = navLinks.filter((link) => link.classList.contains('nav-link'));
const mobileNavLinks = navLinks.filter((link) => !link.classList.contains('nav-link'));
const mainContent = document.getElementById('mainContent');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

const areaSlider = document.getElementById('areaSlider');
const areaValue = document.getElementById('areaValue');
const totalPrice = document.getElementById('totalPrice');
const usdPrice = document.getElementById('usdPrice');
const nbRateDisplay = document.getElementById('nbRateDisplay');
const rateUpdate = document.getElementById('rateUpdate');
const baseRateDisplay = document.getElementById('baseRateDisplay');
const areaDisplay = document.getElementById('areaDisplay');
const floorDisplay = document.getElementById('floorDisplay');
const finishDisplay = document.getElementById('finishDisplay');
const calcResultSummary = document.getElementById('calcResultSummary');
const copyCalcResult = document.getElementById('copyCalcResult');
const shareCalcResult = document.getElementById('shareCalcResult');
const openAnalyticsPanel = document.getElementById('openAnalyticsPanel');
const analyticsPanelBody = document.getElementById('analyticsPanelBody');
const copyAnalyticsEvents = document.getElementById('copyAnalyticsEvents');
const clearAnalyticsEvents = document.getElementById('clearAnalyticsEvents');
const mediaTourPreview = document.getElementById('mediaTourPreview');
const mediaTourHeading = document.getElementById('mediaTourHeading');
const mediaTourDescription = document.getElementById('mediaTourDescription');
const lazyImages = Array.from(document.querySelectorAll('img[data-src]'));
const lazyBackgrounds = Array.from(document.querySelectorAll('[data-bg]'));

const amenityModal = document.getElementById('amenityModal');
const amenityKicker = document.getElementById('amenityKicker');
const amenityTitle = document.getElementById('amenityTitle');
const amenityImage = document.getElementById('amenityImage');
const amenityDescription = document.getElementById('amenityDescription');
const amenityMeta = document.getElementById('amenityMeta');
const amenityHighlights = document.getElementById('amenityHighlights');
const amenityPrimary = document.getElementById('amenityPrimary');
const amenitySecondary = document.getElementById('amenitySecondary');
const newsModal = document.getElementById('newsModal');
const newsModalMeta = document.getElementById('newsModalMeta');
const newsModalTitle = document.getElementById('newsModalTitle');
const newsModalLead = document.getElementById('newsModalLead');
const newsModalPoints = document.getElementById('newsModalPoints');
const newsModalAction = document.getElementById('newsModalAction');

const RATES = {
    standard: 65,
    sky: 95
};

let finishMult = 1.0;
let floorMult = 1.15;
let baseRate = RATES.sky;
let usdRate = 3.25;
let activeModalId = null;
let lastFocusedElement = null;
let currentCalculationSummary = '';
const ANALYTICS_STORAGE_KEY = 'nemiga.analytics.v1';
const ANALYTICS_MAX_EVENTS = 250;
const analyticsSessionId = (() => {
    try {
        const existing = sessionStorage.getItem('nemiga.analytics.session');
        if (existing) return existing;
        const created = crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        sessionStorage.setItem('nemiga.analytics.session', created);
        return created;
    } catch {
        return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
})();

const AMENITY_DETAILS = {
    restaurant: {
        kicker: '40 этаж / открыто',
        title: 'Ресторан "Sky Terrace"',
        image: 'assets/optimized/restaurant-960.webp',
        imageSet: 'assets/optimized/restaurant-640.webp 640w, assets/optimized/restaurant-960.webp 960w, assets/optimized/restaurant-1376.webp 1376w',
        imageAlt: 'Панорамный ресторан Sky Terrace вечером',
        description: 'Верхний ресторан для деловых ужинов, закрытых встреч и спокойных пауз над городом. Это не просто красивая зона: она работает как hospitality-слой для резидентов и гостей башни.',
        meta: ['40 этаж', 'Chef table', 'Вид на центр Минска'],
        highlights: ['Деловые завтраки и ужины для резидентов', 'Приватные столы для переговоров без офисного шума', 'Сезонное меню и отдельные сценарии под мероприятия'],
        primary: 'Запланировать ужин',
        secondary: 'Посмотреть ресторан в туре',
        secondaryTour: 'Sky Terrace'
    },
    fitness: {
        kicker: 'Wellness / резидентский доступ',
        title: 'Фитнес-клуб',
        image: 'assets/optimized/fitness-960.webp',
        imageSet: 'assets/optimized/fitness-640.webp 640w, assets/optimized/fitness-960.webp 960w, assets/optimized/fitness-1376.webp 1376w',
        imageAlt: 'Фитнес-клуб с бассейном и премиальной SPA-зоной',
        description: 'Фитнес, бассейн и SPA встроены в рабочий день, чтобы резидент не тратил время на отдельные поездки. Это повышает ценность объекта для команд, которые живут в офисе не только с 9 до 18.',
        meta: ['25 м бассейн', 'SPA и хаммам', 'Персональные тренировки'],
        highlights: ['Утренние и вечерние слоты для резидентов', 'Зона восстановления после переговоров и перелетов', 'Корпоративные программы для команд'],
        primary: 'Уточнить доступ',
        secondary: 'Посмотреть фитнес в туре',
        secondaryTour: 'Фитнес-клуб'
    },
    coworking: {
        kicker: '24/7 / гибкая работа',
        title: 'Коворкинг и lounge',
        image: 'assets/optimized/gallery-lounge-960.webp',
        imageSet: 'assets/optimized/gallery-lounge-640.webp 640w, assets/optimized/gallery-lounge-960.webp 960w, assets/optimized/gallery-lounge-1376.webp 1376w',
        imageAlt: 'Камерное lounge-пространство для резидентов',
        description: 'Гибкое пространство для быстрых встреч, фокус-работы и ожидания гостей. Оно дополняет офисы, когда команде нужны не только кабинеты, но и живой рабочий ритм внутри здания.',
        meta: ['Open 24/7', '23 человека сейчас', 'Гостевые зоны'],
        highlights: ['Места для коротких созвонов и встреч', 'Lounge-сценарии для ожидания партнеров', 'Доступ рядом с офисами и сервисами башни'],
        primary: 'Забронировать тур',
        secondary: 'Посмотреть lounge',
        secondaryTour: 'Resident lounge'
    },
    parking: {
        kicker: '450 мест / 50 EV-станций',
        title: 'Паркинг и доступ',
        image: 'assets/optimized/hero-960.webp',
        imageSet: 'assets/optimized/hero-640.webp 640w, assets/optimized/hero-960.webp 960w, assets/optimized/hero-1376.webp 1376w',
        imageAlt: 'Фасад Nemiga Tower с вечерней подсветкой',
        description: 'Паркинг работает как часть премиального опыта: быстрый въезд, доступ по Face ID, зарядные станции и понятная вместимость для резидентов и гостей.',
        meta: ['450 мест', '312 свободно', 'Face ID доступ'],
        highlights: ['Отдельные сценарии для резидентов и гостей', 'EV-инфраструктура для электромобилей', 'Безопасный доступ и круглосуточный контроль'],
        primary: 'Уточнить паркинг',
        secondary: 'К офисам',
        secondarySection: 'offices'
    }
};

const NEWS_DETAILS = {
    director: {
        meta: 'Встреча / 03.05.2026',
        title: 'Встреча с директором проекта AI_Nikitka93',
        lead: 'В концепт-истории Nemiga Tower директор проекта AI_Nikitka93 проводит закрытую встречу с будущими резидентами и показывает, как сайт, визуальный стиль и интерактивные сценарии были собраны как портфолио-кейс.',
        points: ['Обсуждение честной демо-рамки: что реально работает, а что является концептом.', 'Разбор AI-assisted workflow: от идеи бизнес-центра до кликабельных секций.', 'План следующего слоя: заявки, аналитика, быстрые туры и публичная проверяемость.'],
        action: 'К контактам',
        section: 'contacts'
    },
    aihall: {
        meta: 'Открытие / 09.05.2026',
        title: 'Открытие AI-зала переговоров',
        lead: 'Вымышленный зал для стратегических встреч на 36 этаже усиливает образ Nemiga Tower как пространства для команд, которые работают с технологиями, презентациями и быстрыми управленческими решениями.',
        points: ['Интерактивная стена для презентаций и проектных карт.', 'Private briefing режим для закрытых встреч.', 'Сценарии света и посадки под переговоры, лекции и demo day.'],
        action: 'Запланировать тур',
        section: 'contacts'
    },
    lounge: {
        meta: 'Lounge / 14.05.2026',
        title: 'Новый зал Resident Lounge',
        lead: 'Resident Lounge добавлен как тихий слой между офисом, рестораном и коворкингом: здесь можно встретить партнера, дождаться переговоров или провести камерную беседу без формальности переговорной.',
        points: ['Мягкая посадка и приватные ниши для коротких встреч.', 'Связь с рестораном Sky Terrace и общим маршрутом гостя.', 'Отдельная атмосфера для вечерних событий резидентов.'],
        action: 'Открыть lounge в туре',
        tour: 'Resident lounge'
    },
    parking: {
        meta: 'Сервис / 21.05.2026',
        title: 'Пилот умного паркинга',
        lead: 'Концепт умного паркинга показывает, как резидент или гость может заранее получить маршрут до места, въездной сценарий и подсказку к нужному лифтовому ядру.',
        points: ['Предварительное назначение гостевого места.', 'EV-станции и быстрый доступ для резидентов.', 'Связка с офисным туром: от паркинга до переговорной без лишних шагов.'],
        action: 'Перейти к паркингу',
        amenity: 'parking'
    }
};

function getStoredAnalyticsEvents() {
    try {
        const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveAnalyticsEvents(events) {
    try {
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events.slice(-ANALYTICS_MAX_EVENTS)));
    } catch {
        // Storage can be unavailable in private or restricted browser contexts.
    }
}

function getCurrentSectionId() {
    return document.querySelector('.section:not([hidden])')?.id || window.location.hash.replace('#', '') || 'home';
}

function sanitizeAnalyticsText(value, fallback = 'unknown') {
    return (value || fallback).toString().replace(/\s+/g, ' ').trim().slice(0, 160) || fallback;
}

function sendAnalyticsEvent(event) {
    const isLocalAnalyticsEndpoint = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    if (!isLocalAnalyticsEndpoint) {
        return;
    }

    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon('/analytics', blob)) return;
    }

    fetch('/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
    }).catch(() => {
        // Static hosting fallback: localStorage still keeps the event for demo review.
    });
}

function trackAnalytics(type, payload = {}) {
    const event = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        timestamp: new Date().toISOString(),
        sessionId: analyticsSessionId,
        path: `${window.location.pathname}${window.location.hash || ''}`,
        section: getCurrentSectionId(),
        viewport: {
            width: Math.round(window.visualViewport?.width || window.innerWidth || 0),
            height: Math.round(window.visualViewport?.height || window.innerHeight || 0)
        },
        ...payload
    };

    const events = [...getStoredAnalyticsEvents(), event].slice(-ANALYTICS_MAX_EVENTS);
    saveAnalyticsEvents(events);
    sendAnalyticsEvent(event);
    renderAnalyticsPanel();
    return event;
}

function describeAnalyticsTarget(target) {
    const element = target.closest?.('button, a, [role="button"], input[type="range"], .option-card');
    if (!element) return null;

    const clone = element.cloneNode(true);
    clone.querySelectorAll('.material-symbols-outlined').forEach((icon) => icon.remove());
    const label = element.getAttribute('aria-label')
        || element.dataset.analyticsLabel
        || clone.textContent
        || element.id
        || element.tagName;

    return {
        tag: element.tagName.toLowerCase(),
        id: element.id || undefined,
        label: sanitizeAnalyticsText(label),
        href: element.tagName.toLowerCase() === 'a' ? element.getAttribute('href') : undefined,
        section: element.dataset.section || undefined,
        action: element.dataset.amenityAction || element.dataset.newsAction || element.dataset.tourTitle || element.dataset.type || undefined
    };
}

function summarizeAnalytics(events) {
    const clicks = events.filter((event) => event.type === 'click').length;
    const errors = events.filter((event) => event.type === 'error' || event.type === 'unhandledrejection').length;
    const sectionViews = events.filter((event) => event.type === 'section_view').length;
    const latestSection = [...events].reverse().find((event) => event.section)?.section || 'home';
    return { clicks, errors, sectionViews, latestSection };
}

function renderAnalyticsPanel() {
    if (!analyticsPanelBody) return;

    const events = getStoredAnalyticsEvents();
    if (!events.length) {
        analyticsPanelBody.innerHTML = '<p class="text-on-surface-variant">Событий пока нет.</p>';
        return;
    }

    const summary = summarizeAnalytics(events);
    const recentEvents = [...events].slice(-12).reverse();
    analyticsPanelBody.innerHTML = `
        <div class="analytics-summary-grid">
            <div class="analytics-stat"><strong>${events.length}</strong><span>Всего событий</span></div>
            <div class="analytics-stat"><strong>${summary.clicks}</strong><span>Клики</span></div>
            <div class="analytics-stat"><strong>${summary.errors}</strong><span>Ошибки</span></div>
            <div class="analytics-stat"><strong>${summary.latestSection}</strong><span>Последний раздел</span></div>
        </div>
        <div class="analytics-event-list">
            ${recentEvents.map((event) => {
                const time = new Date(event.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const details = event.message || event.label || event.target?.label || event.modal || event.section || event.action || 'event';
                return `
                    <article class="analytics-event">
                        <div class="analytics-event-title"><code>${event.type}</code><span>${time}</span></div>
                        <p>${sanitizeAnalyticsText(details, 'event')}</p>
                    </article>
                `;
            }).join('')}
        </div>
    `;
}

async function copyAnalyticsSnapshot() {
    const events = getStoredAnalyticsEvents();
    try {
        await navigator.clipboard.writeText(JSON.stringify(events, null, 2));
        showToast('JSON демо-аналитики скопирован.', 'success');
    } catch {
        showToast('Не удалось скопировать JSON автоматически.', 'info');
    }
}

function clearAnalyticsSnapshot() {
    saveAnalyticsEvents([]);
    renderAnalyticsPanel();
    showToast('Локальная демо-аналитика очищена.', 'info');
}

function initAnalytics() {
    document.addEventListener('click', (event) => {
        const target = describeAnalyticsTarget(event.target);
        if (!target) return;
        trackAnalytics('click', { target, label: target.label });
    }, true);

    window.addEventListener('error', (event) => {
        trackAnalytics('error', {
            message: sanitizeAnalyticsText(event.message, 'Unknown script error'),
            source: event.filename || undefined,
            line: event.lineno || undefined,
            column: event.colno || undefined
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        trackAnalytics('unhandledrejection', {
            message: sanitizeAnalyticsText(event.reason?.message || event.reason || 'Unhandled promise rejection')
        });
    });

    openAnalyticsPanel?.addEventListener('click', () => {
        renderAnalyticsPanel();
        openModal('analyticsModal');
    });
    copyAnalyticsEvents?.addEventListener('click', copyAnalyticsSnapshot);
    clearAnalyticsEvents?.addEventListener('click', clearAnalyticsSnapshot);
    renderAnalyticsPanel();
}

function selectResponsiveCandidate(srcset, fallback) {
    if (!srcset) return fallback;
    const candidates = srcset.split(',')
        .map((candidate) => {
            const [url, descriptor] = candidate.trim().split(/\s+/);
            return {
                url,
                width: descriptor && descriptor.endsWith('w') ? Number.parseInt(descriptor, 10) : Number.POSITIVE_INFINITY
            };
        })
        .filter((candidate) => candidate.url);

    if (!candidates.length) return fallback;

    const viewportWidth = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 960;
    const targetWidth = viewportWidth * Math.min(window.devicePixelRatio || 1, 2);
    const match = candidates
        .sort((a, b) => a.width - b.width)
        .find((candidate) => candidate.width >= targetWidth);

    return (match || candidates[candidates.length - 1]).url;
}

function setResponsiveImage(image, fallback, srcset, sizes = '100vw') {
    if (!image) return;
    if (srcset) {
        image.sizes = sizes;
        image.srcset = srcset;
        if (!image.src || image.src.startsWith('data:')) {
            return;
        }
    } else {
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
    }
    image.src = fallback || selectResponsiveCandidate(srcset, image.src);
}

function motionBehavior() {
    return prefersReducedMotion.matches ? 'auto' : 'smooth';
}

function getFocusableElements(root) {
    return Array.from(root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.hidden && element.offsetParent !== null);
}

// Media Hydration
function hydrateImage(image) {
    if (!image || !image.dataset.src || image.dataset.hydrated === 'true') return;
    
    // Add skeleton loader while loading
    const parent = image.parentElement;
    if (parent && !parent.querySelector('.skeleton-loader')) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader absolute inset-0';
        parent.style.position = 'relative';
        parent.appendChild(skeleton);
        
        image.onload = () => {
            skeleton.style.opacity = '0';
            setTimeout(() => skeleton.remove(), 500);
            image.classList.add('loaded');
        };
    }

    setResponsiveImage(image, image.dataset.src, image.dataset.srcset, image.dataset.sizes || '100vw');
    image.dataset.hydrated = 'true';
}

function hydrateBackground(element) {
    if (!element || !element.dataset.bg || element.dataset.hydrated === 'true') return;
    const imageUrl = selectResponsiveCandidate(element.dataset.bgset, element.dataset.bg);
    element.style.backgroundImage = `url('${imageUrl}')`;
    element.dataset.hydrated = 'true';
}

function hydrateMediaWithin(root) {
    if (!root) return;
    root.querySelectorAll('img[data-src]').forEach(hydrateImage);
    root.querySelectorAll('[data-bg]').forEach(hydrateBackground);
}

function isInsideHiddenSurface(element) {
    const section = element.closest('.section');
    const modal = element.closest('.modal');
    return Boolean(section?.hidden || modal?.getAttribute('aria-hidden') === 'true');
}

function initDeferredMedia() {
    if (!('IntersectionObserver' in window)) {
        hydrateMediaWithin(document);
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (isInsideHiddenSurface(entry.target)) return;
            hydrateImage(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '400px 0px' });

    const backgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (isInsideHiddenSurface(entry.target)) return;
            hydrateBackground(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '400px 0px' });

    lazyImages.forEach((image) => imageObserver.observe(image));
    lazyBackgrounds.forEach((element) => backgroundObserver.observe(element));

    const activeSection = document.querySelector('.section:not([hidden])');
    activeSection?.querySelectorAll('[data-eager-media]').forEach((element) => {
        if (element.matches('img[data-src]')) hydrateImage(element);
        if (element.matches('[data-bg]')) hydrateBackground(element);
    });
}

// Navigation & Sections
function setActiveSection(id, options = {}) {
    const { updateHash = true, moveFocus = true } = options;
    const targetId = sections.some((section) => section.id === id) ? id : 'home';

    sections.forEach((section) => {
        const isActive = section.id === targetId;
        section.hidden = !isActive;
        section.classList.toggle('hidden', !isActive);
        section.setAttribute('aria-hidden', String(!isActive));
        if (isActive) {
            // Re-trigger scroll reveal for newly visible section
            setTimeout(() => initScrollReveal(), 100);
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.dataset.section === targetId;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    desktopNavLinks.forEach((link) => {
        const isActive = link.dataset.section === targetId;
        link.classList.toggle('text-[#D4AF37]', isActive);
        link.classList.toggle('text-slate-400', !isActive);
    });

    mobileNavLinks.forEach((link) => {
        const isActive = link.dataset.section === targetId;
        link.classList.toggle('text-[#D4AF37]', isActive);
        link.classList.toggle('text-on-surface', !isActive);
    });

    if (updateHash) {
        history.replaceState(null, '', `#${targetId}`);
    }

    trackAnalytics('section_view', { section: targetId });
    toggleMobileMenu(false);
    window.scrollTo({ top: 0, behavior: motionBehavior() });

    if (moveFocus) {
        requestAnimationFrame(() => {
            mainContent.focus({ preventScroll: true });
        });
    }
}

function navigateToSection(id) {
    setActiveSection(id);
}

function toggleMobileMenu(forceState) {
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', shouldOpen);
    mobileMenu.setAttribute('aria-hidden', String(!shouldOpen));
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', String(shouldOpen));
    }
}

// Calculator Logic
async function loadExchangeRate() {
    try {
        const response = await fetch('https://api.nbrb.by/exrates/rates/USD?parammode=2');
        if (!response.ok) throw new Error(`NBRB API error: ${response.status}`);
        const data = await response.json();
        const rate = Array.isArray(data) ? data[0] : data;
        if (rate && rate.Cur_OfficialRate) {
            usdRate = parseFloat(rate.Cur_OfficialRate);
            nbRateDisplay.textContent = usdRate.toFixed(4);
            const date = new Date(rate.Date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });
            rateUpdate.textContent = `от ${date}`;
        } else {
            rateUpdate.textContent = '(дефолтный)';
        }
    } catch (error) {
        console.warn('Using fallback exchange rate');
        nbRateDisplay.textContent = usdRate.toFixed(2);
        rateUpdate.textContent = '(дефолтный)';
    }
    calculate();
}

function calculate() {
    const area = parseInt(areaSlider.value, 10);
    const total = Math.round(area * baseRate * floorMult * finishMult);
    const usd = Math.round(total / usdRate);
    animateValue(totalPrice, total);
    animateValue(usdPrice, usd);
    updateCalculationSummary({ area, total, usd });
}

function getSelectedOptionLabel(type) {
    const selected = document.querySelector(`.option-card.selected[data-type="${type}"] .font-semibold`);
    return selected ? selected.textContent.trim() : 'Не выбрано';
}

function updateCalculationSummary({ area, total, usd }) {
    if (!calcResultSummary) return;

    const floorLabel = getSelectedOptionLabel('floor');
    const finishLabel = getSelectedOptionLabel('finish');
    const rateText = `${baseRate.toLocaleString('ru-RU')} BYN/м²`;
    const totalText = `${total.toLocaleString('ru-RU')} BYN / месяц`;
    const usdText = `${usd.toLocaleString('ru-RU')} USD / месяц`;

    currentCalculationSummary = [
        'Nemiga Tower — ориентировочный расчёт аренды',
        `Площадь: ${area.toLocaleString('ru-RU')} м²`,
        `Этаж: ${floorLabel}`,
        `Отделка: ${finishLabel}`,
        `Базовая ставка: ${rateText}`,
        `Итого: ${totalText}`,
        `Примерно: ${usdText} по курсу НБ РБ ${usdRate.toFixed(4)}`,
        'Важно: расчёт является ориентиром и уточняется после консультации.'
    ].join('\n');

    calcResultSummary.textContent = currentCalculationSummary;

    if (shareCalcResult) {
        const shareUrl = `${window.location.origin}${window.location.pathname}#offices`;
        shareCalcResult.href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(currentCalculationSummary)}`;
    }
}

async function copyCalculationSummary() {
    if (!currentCalculationSummary) calculate();

    try {
        await navigator.clipboard.writeText(currentCalculationSummary);
        trackAnalytics('calculator_copy', { label: 'Скопировать итог' });
        showToast('Итог расчёта скопирован. Можно отправить клиенту или reviewer.', 'success');
    } catch (error) {
        showToast('Не удалось скопировать автоматически. Выделите итог расчёта вручную.', 'info');
    }
}

function animateValue(element, target) {
    const start = parseInt(element.textContent.replace(/\s/g, ''), 10) || 0;
    if (start === target) return;

    if (prefersReducedMotion.matches) {
        element.textContent = target.toLocaleString('ru-RU');
        return;
    }

    const duration = 500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (target - start) * easeOutQuart);
        element.textContent = current.toLocaleString('ru-RU');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Visual Effects & Animations
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.dataset.animated !== 'true') {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    if (!target) return;

    if (prefersReducedMotion.matches) {
        element.textContent = target.toLocaleString('ru-RU');
        element.dataset.animated = 'true';
        return;
    }

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + target * easeOutQuart);
        element.textContent = current.toLocaleString('ru-RU');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.dataset.animated = 'true';
        }
    }
    requestAnimationFrame(update);
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach((element) => observer.observe(element));
}

function initParallax() {
    if (prefersReducedMotion.matches) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax-image').forEach((image) => {
            const speed = image.dataset.speed || 0.3;
            image.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

function initCustomCursor() {
    if (prefersReducedMotion.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.addEventListener('mousemove', (event) => {
        const { clientX: x, clientY: y } = event;
        cursorDot.style.transform = `translate(${x}px, ${y}px)`;
        cursorOutline.animate({
            transform: `translate(${x - 20}px, ${y - 20}px)`
        }, { duration: 500, fill: "forwards" });
    });
    
    // Add hover effects for interactive elements
    document.querySelectorAll('a, button, .option-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.style.transform += ' scale(1.5)');
        el.addEventListener('mouseleave', () => cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', ''));
    });
}

// Modals & Forms
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    trackAnalytics('modal_open', { modal: id });
    lastFocusedElement = document.activeElement;
    activeModalId = id;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    hydrateMediaWithin(modal);

    if (id === 'bookingModal') {
        document.getElementById('modalArea').textContent = `${areaValue.textContent} м²`;
        document.getElementById('modalPrice').textContent = `${totalPrice.textContent} BYN`;
    }

    const focusableElements = getFocusableElements(modal);
    if (focusableElements.length > 0) focusableElements[0].focus();
}

function openAmenityDetail(key) {
    const detail = AMENITY_DETAILS[key];
    if (!detail || !amenityModal) return;

    amenityKicker.textContent = detail.kicker;
    amenityTitle.textContent = detail.title;
    setResponsiveImage(amenityImage, detail.image, detail.imageSet, detail.imageSizes || '(max-width: 768px) 92vw, 54vw');
    amenityImage.alt = detail.imageAlt;
    amenityDescription.textContent = detail.description;
    amenityMeta.innerHTML = detail.meta.map((item) => `<span>${item}</span>`).join('');
    amenityHighlights.innerHTML = detail.highlights.map((item) => `<li><span class="material-symbols-outlined filled">check_circle</span>${item}</li>`).join('');
    amenityPrimary.textContent = detail.primary;
    amenitySecondary.textContent = detail.secondary;

    amenityPrimary.onclick = () => {
        closeModal('amenityModal');
        navigateToSection('contacts');
    };

    amenitySecondary.onclick = () => {
        closeModal('amenityModal');
        if (detail.secondaryTour) {
            openModal('mediaTourModal');
            const targetCard = Array.from(document.querySelectorAll('[data-tour-title]'))
                .find((card) => card.dataset.tourTitle === detail.secondaryTour);
            if (targetCard) targetCard.click();
            return;
        }
        if (detail.secondarySection) navigateToSection(detail.secondarySection);
    };

    openModal('amenityModal');
}

function openNewsDetail(key) {
    const detail = NEWS_DETAILS[key];
    if (!detail || !newsModal) return;

    newsModalMeta.textContent = detail.meta;
    newsModalTitle.textContent = detail.title;
    newsModalLead.textContent = detail.lead;
    newsModalPoints.innerHTML = detail.points.map((point) => `<p>${point}</p>`).join('');
    newsModalAction.textContent = detail.action;
    newsModalAction.onclick = () => {
        closeModal('newsModal');
        if (detail.tour) {
            openModal('mediaTourModal');
            const targetCard = Array.from(document.querySelectorAll('[data-tour-title]'))
                .find((card) => card.dataset.tourTitle === detail.tour);
            if (targetCard) targetCard.click();
            return;
        }
        if (detail.amenity) {
            openAmenityDetail(detail.amenity);
            return;
        }
        if (detail.section) navigateToSection(detail.section);
    };

    openModal('newsModal');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    activeModalId = null;
    document.body.classList.remove('modal-open');

    if (lastFocusedElement) lastFocusedElement.focus();
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const icon = type === 'success' ? 'check_circle' : 'info';
    toast.className = 'toast glass-card px-6 py-4 rounded-xl flex items-center gap-3 bg-surface-container-low border border-white/10';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span class="material-symbols-outlined text-primary">${icon}</span><span class="font-medium">${message}</span>`;
    container.appendChild(toast);
    
    requestAnimationFrame(() => toast.classList.add('active'));
    
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

window.handleSubmit = (event) => {
    event.preventDefault();
    trackAnalytics('form_demo_submit', { form: 'contacts' });
    showToast('Демо-режим: заявка показана, но данные никуда не отправлены.', 'info');
    event.target.reset();
};

window.handleModalSubmit = (event, modalId) => {
    event.preventDefault();
    trackAnalytics('form_demo_submit', { form: modalId });
    closeModal(modalId);
    showToast('Демо-режим: действие сработало на экране, реальная заявка не создана.', 'info');
    event.target.reset();
};

// Initialization
function init() {
    initNavigation();
    initGalleryFilters();
    initAmenityCards();
    initNewsCards();
    initMediaTour();
    initDeferredMedia();
    initCustomCursor();
    initParallax();
    initKeyboardGuards();
    initOptionCards();
    initRangeSlider();
    initCalculationActions();
    initAnalytics();
    initScrollReveal();
    initCounters();
    calculate();
    
    // Page Loader
    window.addEventListener('load', () => {
        const progress = document.getElementById('loaderProgress');
        const loader = document.getElementById('pageLoader');
        if (progress) progress.style.width = '100%';
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
        }, prefersReducedMotion.matches ? 150 : 800);
        loadExchangeRate();
    });

    // Hash sync
    const syncFromHash = () => {
        const hash = window.location.hash.replace('#', '');
        setActiveSection(hash || 'home', { updateHash: !hash, moveFocus: false });
    };
    window.addEventListener('hashchange', syncFromHash);
    syncFromHash();
    
    calculate();
}

// Helpers for event listeners
function initNavigation() {
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveSection(link.dataset.section);
        });
    });
}

function initGalleryFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            items.forEach((item) => {
                item.hidden = filter !== 'all' && item.dataset.category !== filter;
            });
        });
    });
}

function initAmenityCards() {
    document.querySelectorAll('[data-amenity-card], [data-amenity-action]').forEach((element) => {
        const key = element.dataset.amenityCard || element.dataset.amenityAction;
        element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openAmenityDetail(key);
        });
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openAmenityDetail(key);
            }
        });
    });
}

function initNewsCards() {
    document.querySelectorAll('[data-news-card], [data-news-action]').forEach((element) => {
        const key = element.dataset.newsCard || element.dataset.newsAction;
        element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openNewsDetail(key);
        });
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openNewsDetail(key);
            }
        });
    });
}

function initMediaTour() {
    const cards = Array.from(document.querySelectorAll('[data-tour-image]'));
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            cards.forEach((c) => c.dataset.active = 'false');
            card.dataset.active = 'true';
            hydrateImage(card.querySelector('img'));
            setResponsiveImage(mediaTourPreview, card.dataset.tourImage, card.dataset.tourSrcset, card.dataset.tourSizes || '(max-width: 768px) 92vw, 72vw');
            mediaTourHeading.textContent = card.dataset.tourTitle;
            mediaTourDescription.textContent = card.dataset.tourDescription;
        });
    });
}

function initKeyboardGuards() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (activeModalId) closeModal(activeModalId);
            else if (mobileMenu.classList.contains('active')) toggleMobileMenu(false);
        }
        // Tab trapping logic...
    });
}

function initOptionCards() {
    document.querySelectorAll('.option-card').forEach((card) => {
        card.addEventListener('click', function() {
            const group = this.parentElement;
            group.querySelectorAll('.option-card').forEach(c => {
                c.classList.remove('selected');
                const icon = c.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'radio_button_unchecked';
                    icon.classList.remove('filled', 'text-primary');
                }
            });
            this.classList.add('selected');
            const icon = this.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = 'check_circle';
                icon.classList.add('filled', 'text-primary');
            }
            
            const type = this.dataset.type;
            const mult = parseFloat(this.dataset.multiplier);
            if (type === 'finish') {
                finishMult = mult;
                finishDisplay.textContent = mult.toFixed(2);
            } else if (type === 'floor') {
                floorMult = mult;
                baseRate = mult === 1.0 ? RATES.standard : RATES.sky;
                floorDisplay.textContent = mult.toFixed(2);
                baseRateDisplay.textContent = baseRate;
            }
            calculate();
        });
    });
}

function initRangeSlider() {
    if (!areaSlider) return;
    areaSlider.addEventListener('input', function() {
        areaValue.textContent = this.value;
        areaDisplay.textContent = this.value;
        this.style.setProperty('--range-progress', `${((this.value - 50) / 950) * 100}%`);
        calculate();
    });
    areaSlider.style.setProperty('--range-progress', '20%');
}

function initCalculationActions() {
    copyCalcResult?.addEventListener('click', copyCalculationSummary);
}

// Global scope expose for onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.navigateToSection = navigateToSection;
window.openAmenityDetail = openAmenityDetail;
window.openNewsDetail = openNewsDetail;
window.toggleMobileMenu = toggleMobileMenu;
window.showToast = showToast;
window.NemigaAnalytics = {
    track: trackAnalytics,
    getEvents: getStoredAnalyticsEvents,
    clear: clearAnalyticsSnapshot,
    render: renderAnalyticsPanel
};

init();
