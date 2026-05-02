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
const mediaTourPreview = document.getElementById('mediaTourPreview');
const mediaTourHeading = document.getElementById('mediaTourHeading');
const mediaTourDescription = document.getElementById('mediaTourDescription');
const lazyImages = Array.from(document.querySelectorAll('img[data-src]'));
const lazyBackgrounds = Array.from(document.querySelectorAll('[data-bg]'));

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

    image.src = image.dataset.src;
    image.dataset.hydrated = 'true';
}

function hydrateBackground(element) {
    if (!element || !element.dataset.bg || element.dataset.hydrated === 'true') return;
    element.style.backgroundImage = `url('${element.dataset.bg}')`;
    element.dataset.hydrated = 'true';
}

function hydrateMediaWithin(root) {
    if (!root) return;
    root.querySelectorAll('img[data-src]').forEach(hydrateImage);
    root.querySelectorAll('[data-bg]').forEach(hydrateBackground);
}

function initDeferredMedia() {
    if (!('IntersectionObserver' in window)) {
        hydrateMediaWithin(document);
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            hydrateImage(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '400px 0px' });

    const backgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            hydrateBackground(entry.target);
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '400px 0px' });

    lazyImages.forEach((image) => imageObserver.observe(image));
    lazyBackgrounds.forEach((element) => backgroundObserver.observe(element));

    hydrateMediaWithin(document.getElementById('home'));
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
            hydrateMediaWithin(section);
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
    showToast('Заявка отправлена. Менеджер свяжется с вами в течение 15 минут.', 'success');
    event.target.reset();
};

window.handleModalSubmit = (event, modalId) => {
    event.preventDefault();
    closeModal(modalId);
    showToast('Спасибо. Мы уже готовим для вас персональный маршрут по объекту.', 'success');
    event.target.reset();
};

// Initialization
function init() {
    initNavigation();
    initGalleryFilters();
    initMediaTour();
    initDeferredMedia();
    initCustomCursor();
    initParallax();
    initKeyboardGuards();
    initOptionCards();
    initRangeSlider();
    initScrollReveal();
    initCounters();
    
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

function initMediaTour() {
    const cards = Array.from(document.querySelectorAll('[data-tour-image]'));
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            cards.forEach((c) => c.dataset.active = 'false');
            card.dataset.active = 'true';
            hydrateImage(card.querySelector('img'));
            mediaTourPreview.src = card.dataset.tourImage;
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

// Global scope expose for onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.navigateToSection = navigateToSection;
window.toggleMobileMenu = toggleMobileMenu;
window.showToast = showToast;

init();
