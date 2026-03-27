const { test, expect } = require('@playwright/test');

async function stabilizePage(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);
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
