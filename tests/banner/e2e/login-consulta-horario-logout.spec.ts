import { test } from '@playwright/test';
import { getBannerEnv } from './data/banner.env.schema';
import { BannerHomePage } from './pages/banner-home.page';
import { BannerLoginPage } from './pages/banner-login.page';
import { BannerSchedulePage } from './pages/banner-schedule.page';
import { appendBannerRunLog, buildScreenshotPath } from './utils/banner-log';

const bannerSite = 'https://landing.unapec.edu.do/banner/';

test.describe('Banner E2E real', () => {
  test('BANNER-E2E-001 login -> consulta horario -> logout', async ({ page }) => {
    let env = getBannerEnv();
    const loginPage = new BannerLoginPage(page);
    const homePage = new BannerHomePage(page);
    const schedulePage = new BannerSchedulePage(page);

    const postLoginScreenshotPath = buildScreenshotPath('post-login');
    const postLogoutScreenshotPath = buildScreenshotPath('post-logout');
    let displayName = env.bannerUsername;
    let subjectsCount = 0;
    let periodValue = '';
    let periodLabel = '';
    let usedFallbackPeriod = false;
    let scheduleScreenshots = {
      wrapperPath: buildScreenshotPath('lookup-wrapper-failed'),
      calendarPath: buildScreenshotPath('schedule-calendar-failed'),
    };

    try {
      await test.step('Validar entorno de credenciales (.env)', async () => {
        env = getBannerEnv();
      });

      await test.step('Abrir landing y portal Banner', async () => {
        await loginPage.gotoLanding();
        await loginPage.openBannerPortal();
      });

      await test.step('Autenticarse con cuenta real', async () => {
        await loginPage.login(env.bannerUsername, env.bannerPassword);
        await homePage.assertAuthenticated();
        await page.screenshot({ path: postLoginScreenshotPath, fullPage: true });
      });

      await test.step('Consultar horario de clase', async () => {
        displayName = await homePage.getDisplayName(env.bannerUsername);
        await homePage.gotoClassSchedule();
        const periodSelection = await schedulePage.selectTargetPeriod();
        periodValue = periodSelection.selectedValue;
        periodLabel = periodSelection.selectedLabel;
        usedFallbackPeriod = periodSelection.usedFallback;
        await schedulePage.assertScheduleVisible();
        await schedulePage.ensureSchedulePanelsVisibleAndScrolled();
        subjectsCount = await schedulePage.countSubjectsByNrc();
        scheduleScreenshots = await schedulePage.captureScheduleEvidence();
      });

      await test.step('Cerrar sesion', async () => {
        await homePage.logout();
        await homePage.assertLoggedOut();
        await page.screenshot({ path: postLogoutScreenshotPath, fullPage: true });
      });

      appendBannerRunLog({
        timestamp: new Date().toISOString(),
        site: bannerSite,
        username: env.bannerUsername,
        displayName,
        subjectsCount,
        periodValue,
        periodLabel,
        usedFallbackPeriod,
        scheduleScreenshots,
        scheduleScreenshotPath: scheduleScreenshots.wrapperPath,
        status: 'passed',
      });
    } catch (error) {
      appendBannerRunLog({
        timestamp: new Date().toISOString(),
        site: bannerSite,
        username: env.bannerUsername,
        displayName,
        subjectsCount,
        periodValue,
        periodLabel,
        usedFallbackPeriod,
        scheduleScreenshots,
        scheduleScreenshotPath: scheduleScreenshots.wrapperPath,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  });

  test('BANNER-E2E-002 login invalido muestra error y registra fallo', async ({ page }) => {
    let env = getBannerEnv();
    test.skip(!env.runNegative, 'Set BANNER_RUN_NEGATIVE=true to run negative login test.');

    await test.step('Validar entorno de credenciales (.env)', async () => {
      env = getBannerEnv();
    });

    const loginPage = new BannerLoginPage(page);
    const negativeScreenshotPath = buildScreenshotPath('login-invalido');
    const invalidPassword = `${env.bannerPassword}x`;

    await loginPage.gotoLanding();
    await loginPage.openBannerPortal();
    await loginPage.login(env.bannerUsername, invalidPassword);
    await loginPage.assertLoginErrorVisible();
    await page.screenshot({ path: negativeScreenshotPath, fullPage: true });

    appendBannerRunLog({
      timestamp: new Date().toISOString(),
      site: bannerSite,
      username: env.bannerUsername,
      displayName: env.bannerUsername,
      subjectsCount: 0,
      scheduleScreenshotPath: negativeScreenshotPath,
      status: 'failed',
      errorCode: 'INVALID_LOGIN_EXPECTED',
      errorMessage: 'Negative test with intentionally invalid password.',
    });
  });

  test('BANNER-E2E-003 resiliencia: ruta horario no disponible genera evidencia', async ({ page }) => {
    let env = getBannerEnv();
    test.skip(!env.runResilience, 'Set BANNER_RUN_RESILIENCE=true to run resilience test.');

    await test.step('Validar entorno de credenciales (.env)', async () => {
      env = getBannerEnv();
    });

    const loginPage = new BannerLoginPage(page);
    const evidencePath = buildScreenshotPath('ruta-horario-no-disponible');

    await loginPage.gotoLanding();
    await loginPage.openBannerPortal();
    await loginPage.login(env.bannerUsername, env.bannerPassword);

    await page.goto('https://registro.unapec.edu.do/StudentRegistrationSsb/ssb/registration/non-existent', {
      waitUntil: 'domcontentloaded',
    });
    await page.screenshot({ path: evidencePath, fullPage: true });

    appendBannerRunLog({
      timestamp: new Date().toISOString(),
      site: bannerSite,
      username: env.bannerUsername,
      displayName: env.bannerUsername,
      subjectsCount: 0,
      scheduleScreenshotPath: evidencePath,
      status: 'failed',
      errorCode: 'SCHEDULE_ROUTE_NOT_FOUND',
      errorMessage: 'Simulated unavailable schedule route to validate resilience evidence.',
    });
  });
});
