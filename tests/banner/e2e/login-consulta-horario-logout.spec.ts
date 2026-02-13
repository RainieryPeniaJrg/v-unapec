import { test } from '@playwright/test';
import { getBannerEnv } from './data/banner.env.schema';
import { BannerHomePage } from './pages/banner-home.page';
import { BannerLoginPage } from './pages/banner-login.page';
import { BannerSchedulePage } from './pages/banner-schedule.page';
import { appendBannerRunLog, buildScreenshotPath, logDetailedConsole, logTableSummary } from './utils/banner-log';

const bannerSite = 'https://landing.unapec.edu.do/banner/';
const visualPauseMs = Number(process.env.PW_VISUAL_PAUSE ?? 1500);

test.describe('Banner E2E real', () => {
  // CONTEXTO: Test E2E de Banner Student Information System (UNAPEC)
  // Propósito: Validar flujo real de autenticación OAuth, consulta de horario y cierre de sesión
  // Nivel: Sistema completo (E2E)
  // Navegador: Edge (Playwright con slowMo=1500ms para visualización)
  // Criterios de Aceptación:
  //   ✓ Login exitoso con credenciales de Microsoft AAD
  //   ✓ Navegación a sección de horario
  //   ✓ Consulta de asignaturas registradas en período
  //   ✓ Logout sin errores
  //   ✓ Logging completo con evidencias (screenshots, JSONL)

  test('BANNER-E2E-001 login -> consulta horario -> logout', async ({ page }, testInfo) => {
    const startedAt = Date.now();
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
      logDetailedConsole('BANNER-E2E-001: Login → Consulta Horario → Logout', 'start');
      console.log(`👤 Usuario: ${env.bannerUsername}`);
      console.log(`🌐 Navegador: ${testInfo.project.name}`);
      console.log(`⏱️  Inicio: ${new Date().toLocaleTimeString()}\n`);
      await page.waitForTimeout(visualPauseMs);

      await test.step('Validar entorno de credenciales (.env)', async () => {
        logDetailedConsole('Validando credenciales del entorno', 'start');
        env = getBannerEnv();
        logDetailedConsole('Credenciales validadas', 'success');
      });

      await test.step('Abrir landing y portal Banner', async () => {
        logDetailedConsole('Navegando a landing.unapec.edu.do/banner/', 'start');
        await loginPage.gotoLanding();
        logDetailedConsole('Landing cargada', 'success');

        logDetailedConsole('Buscando botón "Acceso para estudiantes"', 'start');
        await loginPage.openBannerPortal();
        logDetailedConsole('Portal Banner abierto', 'success');
      });

      await test.step('Autenticarse con cuenta real', async () => {
        logDetailedConsole(`Iniciando sesión como ${env.bannerUsername}`, 'start');
        await loginPage.login(env.bannerUsername, env.bannerPassword);
        logDetailedConsole('Credenciales enviadas', 'success');

        logDetailedConsole('Validando autenticación', 'start');
        await homePage.assertAuthenticated();
        logDetailedConsole('Autenticación confirmada ✅', 'success');

        logDetailedConsole('Capturando screenshot post-login', 'start');
        await page.screenshot({ path: postLoginScreenshotPath, fullPage: true });
        logDetailedConsole(`Screenshot guardado: ${postLoginScreenshotPath}`, 'success');
      });

      await test.step('Consultar horario de clase', async () => {
        logDetailedConsole('Obteniendo nombre mostrado del usuario', 'start');
        displayName = await homePage.getDisplayName(env.bannerUsername);
        logDetailedConsole(`Nombre mostrado: "${displayName}"`, 'success');

        logDetailedConsole('Navegando a consultar horario', 'start');
        await homePage.gotoClassSchedule();
        logDetailedConsole('Página de horario cargada', 'success');

        logDetailedConsole('Seleccionando período (202610 o período actual)', 'start');
        const periodSelection = await schedulePage.selectTargetPeriod();
        periodValue = periodSelection.selectedValue;
        periodLabel = periodSelection.selectedLabel;
        usedFallbackPeriod = periodSelection.usedFallback;
        const fallbackMsg = usedFallbackPeriod ? ' (FALLBACK)' : '';
        logDetailedConsole(`Período seleccionado: ${periodValue} - "${periodLabel}"${fallbackMsg}`, 'success');

        logDetailedConsole('Validando visibilidad del horario', 'start');
        await schedulePage.assertScheduleVisible();
        logDetailedConsole('Horario visible en pantalla', 'success');

        logDetailedConsole('Scrolleando contenedores para cargar asignaturas', 'start');
        await schedulePage.ensureSchedulePanelsVisibleAndScrolled();
        logDetailedConsole('Scroll completado', 'success');

        logDetailedConsole('Contando asignaturas (XPath → CSS → JS fallback)', 'start');
        subjectsCount = await schedulePage.countSubjectsByNrc();
        logDetailedConsole(`✅ Asignaturas contadas: ${subjectsCount}`, 'success');

        logDetailedConsole('Capturando evidencia de horario', 'start');
        scheduleScreenshots = await schedulePage.captureScheduleEvidence();
        logDetailedConsole(`Screenshots: wrapper="${scheduleScreenshots.wrapperPath}" calendar="${scheduleScreenshots.calendarPath}"`, 'success');
      });

      await test.step('Cerrar sesion', async () => {
        logDetailedConsole('Buscando botón de logout', 'start');
        await homePage.logout();
        logDetailedConsole('Logout ejecutado', 'success');

        logDetailedConsole('Validando sesión cerrada', 'start');
        await homePage.assertLoggedOut();
        logDetailedConsole('Sesión cerrada confirmada ✅', 'success');

        logDetailedConsole('Capturando screenshot post-logout', 'start');
        await page.screenshot({ path: postLogoutScreenshotPath, fullPage: true });
        logDetailedConsole(`Screenshot guardado: ${postLogoutScreenshotPath}`, 'success');
      });

      const duracion = Date.now() - startedAt;
      const logEntry = {
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
        caso: testInfo.title,
        duracionMs: duracion,
        navegador: testInfo.project.name,
        status: 'passed' as const,
      };

      appendBannerRunLog(logEntry);
      logTableSummary(logEntry);
    } catch (error) {
      const duracion = Date.now() - startedAt;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      logDetailedConsole('Error durante ejecución', 'error', errorMsg);

      const failEntry = {
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
        caso: testInfo.title,
        duracionMs: duracion,
        navegador: testInfo.project.name,
        status: 'failed' as const,
        errorMessage: errorMsg,
      };

      appendBannerRunLog(failEntry);
      logTableSummary(failEntry);
      throw error;
    }
  });

  test('BANNER-E2E-002 login invalido muestra error y registra fallo', async ({ page }, testInfo) => {
    const startedAt = Date.now();
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
      caso: testInfo.title,
      duracionMs: Date.now() - startedAt,
      navegador: testInfo.project.name,
      status: 'failed',
      errorCode: 'INVALID_LOGIN_EXPECTED',
      errorMessage: 'Negative test with intentionally invalid password.',
    });
  });

  test('BANNER-E2E-003 resiliencia: ruta horario no disponible genera evidencia', async ({ page }, testInfo) => {
    const startedAt = Date.now();
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
      caso: testInfo.title,
      duracionMs: Date.now() - startedAt,
      navegador: testInfo.project.name,
      status: 'failed',
      errorCode: 'SCHEDULE_ROUTE_NOT_FOUND',
      errorMessage: 'Simulated unavailable schedule route to validate resilience evidence.',
    });
  });
});
