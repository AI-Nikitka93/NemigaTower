const { test, expect } = require('@playwright/test');

async function stabilizePage(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://api.nbrb.by/exrates/rates/USD?parammode=2', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]'
    });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('#mainContent').waitFor({ state: 'attached' });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('hidden');
    }
    document.querySelectorAll('.stat-number').forEach((element) => {
      if (element.dataset.count) {
        element.textContent = Number(element.dataset.count).toLocaleString('ru-RU');
      }
    });
    window.scrollTo(0, 0);
  });
}

async function switchToSection(page, sectionId) {
  await page.evaluate((id) => {
    window.location.hash = id;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, sectionId);
  await page.waitForTimeout(300);
}

async function openMediaTour(page) {
  await page.evaluate(() => {
    if (typeof window.openModal === 'function') {
      window.openModal('mediaTourModal');
    }
  });
  await page.waitForTimeout(200);
}

test.describe('visual coverage', () => {
  test('desktop home screen stays polished', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('home-desktop.png', { fullPage: true });
  });

  test('desktop infrastructure screen remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);
    await switchToSection(page, 'infrastructure');
    await expect(page).toHaveScreenshot('infrastructure-desktop.png', { fullPage: true });
  });

  test('desktop offices screen remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);
    await switchToSection(page, 'offices');
    await expect(page).toHaveScreenshot('offices-desktop.png', { fullPage: true });
  });

  test('desktop contacts screen and form remain consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);
    await switchToSection(page, 'contacts');
    await expect(page).toHaveScreenshot('contacts-desktop.png', { fullPage: true });
  });

  test('calculator result can be copied and shared', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);
    await switchToSection(page, 'offices');

    await page.evaluate(() => {
      window.__copiedCalculatorText = '';
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__copiedCalculatorText = text;
          }
        }
      });
    });

    await page.locator('#areaSlider').fill('300');
    await expect(page.locator('#calcResultSummary')).toContainText('Площадь: 300 м²');
    await expect(page.locator('#calcResultSummary')).toContainText('BYN / месяц');

    await page.getByRole('button', { name: 'Скопировать итог' }).click();
    await expect(page.getByText('Итог расчёта скопирован')).toBeVisible();
    const copiedText = await page.evaluate(() => window.__copiedCalculatorText);
    expect(copiedText).toContain('Площадь: 300 м²');
    expect(copiedText).toContain('BYN / месяц');

    await expect(page.locator('#shareCalcResult')).toHaveAttribute('href', /t\.me\/share\/url/);
  });

  test('basic analytics records clicks and errors in the demo panel', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);

    await page.evaluate(() => window.NemigaAnalytics?.clear());
    await page.getByRole('button', { name: /Обзор пространства/ }).click();
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      window.dispatchEvent(new ErrorEvent('error', {
        message: 'Synthetic analytics test error',
        filename: 'analytics-test.js',
        lineno: 7,
        colno: 3
      }));
    });

    await page.getByRole('button', { name: 'Открыть демо-аналитику' }).click();
    await expect(page.getByRole('heading', { name: 'Демо-аналитика' })).toBeVisible();
    await expect(page.locator('#analyticsPanelBody')).toContainText('click');
    await expect(page.locator('#analyticsPanelBody')).toContainText('error');
    await expect(page.locator('#analyticsPanelBody')).toContainText('Synthetic analytics test error');

    const events = await page.evaluate(() => window.NemigaAnalytics.getEvents());
    expect(events.some((event) => event.type === 'click')).toBeTruthy();
    expect(events.some((event) => event.type === 'error')).toBeTruthy();
  });

  test('contact forms are explicitly marked as demo', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);
    await switchToSection(page, 'contacts');

    await expect(page.getByText('Это демонстрационная форма портфолио.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Показать демо-отправку' })).toBeVisible();

    const contactForm = page.locator('#contacts form');
    await contactForm.getByLabel('Имя').fill('Тест');
    await contactForm.getByLabel('Телефон').fill('+375291234567');
    await contactForm.getByRole('button', { name: 'Показать демо-отправку' }).click();
    await expect(page.getByText('Демо-режим: заявка показана, но данные никуда не отправлены.')).toBeVisible();

    await page.evaluate(() => window.openModal('callbackModal'));
    await expect(page.getByRole('heading', { name: 'Демо-звонок' })).toBeVisible();
    await expect(page.getByText('Демо-форма: номер не отправляется')).toBeVisible();
    await page.keyboard.press('Escape');

    await page.evaluate(() => window.openModal('bookingModal'));
    await expect(page.getByRole('heading', { name: 'Демо-бронирование' })).toBeVisible();
    await expect(page.getByText('Демо-форма: офис не бронируется')).toBeVisible();
  });

  test('desktop media tour modal remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop only');
    await stabilizePage(page);
    await openMediaTour(page);
    await expect(page).toHaveScreenshot('media-tour-desktop.png', { fullPage: true });
  });

  test('mobile home screen remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile only');
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('home-mobile.png', { fullPage: true });
  });

  test('mobile menu opens from the visible toggle', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile only');
    await stabilizePage(page);

    const toggle = page.locator('#mobileMenuToggle');
    const toggleBox = await toggle.boundingBox();
    const viewportWidth = await page.evaluate(() => window.visualViewport.width);
    expect(toggleBox).not.toBeNull();
    expect(toggleBox.x).toBeGreaterThanOrEqual(0);
    expect(toggleBox.x + toggleBox.width).toBeLessThanOrEqual(viewportWidth);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobileMenu')).toHaveAttribute('aria-hidden', 'false');
  });

  test('mobile infrastructure screen remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile only');
    await stabilizePage(page);
    await switchToSection(page, 'infrastructure');
    await expect(page).toHaveScreenshot('infrastructure-mobile.png', { fullPage: true });
  });

  test('mobile offices screen remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile only');
    await stabilizePage(page);
    await switchToSection(page, 'offices');
    await expect(page).toHaveScreenshot('offices-mobile.png', { fullPage: true });
  });

  test('mobile contacts screen remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile only');
    await stabilizePage(page);
    await switchToSection(page, 'contacts');
    await expect(page).toHaveScreenshot('contacts-mobile.png', { fullPage: true });
  });

  test('mobile media tour modal remains consistent', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile only');
    await stabilizePage(page);
    await openMediaTour(page);
    await expect(page).toHaveScreenshot('media-tour-mobile.png');
  });
});
