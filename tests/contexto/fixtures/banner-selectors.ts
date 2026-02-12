/**
 * Selectores CSS, XPath y atributos centralizados para tests Banner E2E
 * 
 * Propósito: Mantener selectores en un solo lugar para facilitar cambios
 * cuando Banner actualiza su HTML/CSS.
 * 
 * Uso en page objects:
 * ```typescript
 * import { SELECTORS } from '../contexto/fixtures/banner-selectors';
 * 
 * constructor(private page: Page) {
 *   this.loginButton = page.locator(SELECTORS.login.button);
 * }
 * ```
 */

export const SELECTORS = {
  /**
   * Selectores del formulario de login (OAuth Microsoft)
   */
  login: {
    // Pantalla 1: Ingreso de email
    emailInput: '#i0116, input[name="loginfmt"]',
    emailInputAlt: 'input[id^="i0116"]',
    nextButton: '#idSIButton9, input[type="submit"][value="Next"]',

    // Pantalla 2: Ingreso de password
    passwordInput: '#i0118, input[name="passwd"]',
    passwordInputAlt: 'input[id^="i0118"]',
    signInButton: '#idSIButton9, input[type="submit"][value="Sign in"]',

    // Pantalla 3: "Stay signed in?"
    staySignedInYes: 'input[type="button"][value="Yes"]',
    staySignedInNo: 'input[type="submit"][value="No"]',
    staySignedInCheckbox: 'input[name="DontShowAgain"]',

    // Errores de login
    errorContainer: '#error, [id*="error"], [class*="error"]',
    errorMessage: '[id*="errorText"], [class*="error-message"], .error',

    // Pantalla "Use another account"
    useAnotherAccountButton: 'input[value="Use another account"]',
  },

  /**
   * Selectores de página principal (después de login exitoso)
   */
  home: {
    // Indicadores de autenticación
    registerLink: '#registerLink',
    scheduleLink: '#scheduleLink',
    logoutLink: '#logoutLink, [aria-label*="Logout"], a:has-text("Log out")',
    logoutAlt: 'a[href*="/logout"], button:has-text("Salir")',

    // Información del usuario
    displayNameMeta: 'meta[name="fullName"]',
    displayName: '[class*="display-name"], [id*="name"], .user-info',

    // Menu principal
    mainMenu: '#mainMenu, [role="navigation"]',
  },

  /**
   * Selectores de página de horario (consultar clase)
   */
  schedule: {
    // Tabs y vista
    lookupScheduleTab: '#lookupSchedule-tab',
    scheduleDetailsViewLink: '#scheduleDetailsViewLink',

    // Contenedores principales
    lookupScheduleWrapper: '#lookupSchedule-wrapper',
    lookupScheduleTable: '#lookupScheduleTable',
    scheduleListView: '#scheduleListView',
    scheduleCalendar: '#scheduleCalendar',

    // Select de período
    periodSelect: '#lookupFilter',
    periodOption: '#lookupFilter option',

    // Elementos de asignatura (CRÍTICO para conteo)
    // Estos links están dentro de tabla renderizada dinámicamente
    subjectLinkCSS: 'a.section-details-link', // ⭐ PRIMERO - CSS directo
    subjectLinkXPath: "//a[@class='section-details-link']", // ⭐ XPath robusto
    subjectTableXPath: "/html/body/main/div[2]/div/div[4]/div[5]/div[1]/div[1]/div/div[2]/div[3]/div[1]/div[1]/div/table/tbody/tr", // Estructura exacta
    
    // ID de tabla si existe
    subjectTableById: '#table1',
    subjectTableByIdRows: '#table1 > tbody > tr',
    
    // Alternativas si la tabla está en otro contenedor
    subjectRow: 'table tbody tr, [role="row"]',
    subjectListItem: '.listViewItem, .classDetailsDiv',
    subjectByNRC: 'div:has-text("NRC")',

    // Tabla general
    tableRow: 'table tbody tr, [role="row"]',
    tableCell: 'td, [role="cell"]',

    // Indicadores de carga
    spinner: '[class*="spinner"], [class*="loading"], .progress',
  },

  /**
   * Selectores OAuth Microsoft (Universal en O365)
   */
  oauth: {
    // Elementos comunes en flujo OAuth
    emailField: 'input[type="email"], input[name="loginfmt"], #i0116',
    passwordField: 'input[type="password"], input[name="passwd"], #i0118',
    submitButton: 'input[type="submit"], button[type="submit"]',
    checkboxRemember: 'input[name="DontShowAgain"]',

    // Errores OAuth
    errorAlert: '.error, .alert-error, [role="alert"]',
  },

  /**
   * Selectores genéricos para validación
   */
  generic: {
    mainContent: 'main, [role="main"]',
    body: 'body',
    page: 'html',
    loadingIndicator: '[class*="load"], [class*="spin"]',
    successMessage: '[class*="success"], [class*="alert-success"]',
    errorMessage: '[class*="error"], [class*="alert-error"]',
  },
};

/**
 * XPath expresiones robustas como fallback
 * 
 * Uso:
 * ```typescript
 * const count = await page.locator(`xpath=${XPATHS.subjectRows}`).count();
 * ```
 */
export const XPATHS = {
  /**
   * Contar asignaturas por link de datos
   * HTML: <a class="section-details-link" data-attributes="202610,2085">DISEÑO WEB</a>
   * Este es el XPath más robusto - primero intentar este
   */
  subjectByLink: "//a[@class='section-details-link']",

  /**
   * XPath absoluto desde raíz (estructura exacta de la tabla)
   * Estructura completa: /html/body/main/div[2]/.../table/tbody/tr
   */
  subjectTableAbsolute: "/html/body/main/div[2]/div/div[4]/div[5]/div[1]/div[1]/div/div[2]/div[3]/div[1]/div[1]/div/table/tbody/tr",

  /**
   * Si la tabla tiene ID #table1
   */
  subjectTableById: "//*[@id='table1']/tbody/tr",
  subjectByLinkInTable: "//*[@id='table1']//a[@class='section-details-link']",

  /**
   * Alternativas para encontrar filas
   */
  tableRows: "//table//tbody//tr[position() > 0]",
  tableRowsWithClass: "//tr[contains(@class, 'course') or contains(@class, 'subject') or contains(@class, 'slick')]",
  
  /**
   * Encontrar elementos con NRC (código de curso)
   */
  elementWithNRC: "//*[contains(text(), 'NRC')]",
  divWithNRC: "//div[contains(text(), 'NRC')]",

  /**
   * Encontrar select de período
   */
  periodSelect: "//select[@id='lookupFilter']",

  /**
   * Encontrar errores
   */
  errorElement: "//*[contains(@class, 'error') or contains(@id, 'error')]",

  /**
   * Encontrar botón logout
   */
  logoutButton: "//a[contains(@href, 'logout')] | //button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'logout')] | //a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'salir')]",
};

/**
 * Mapeo de atributos data-* para métodos de identificación resilientes
 * 
 * Ejemplo: Si Banner usa data-attributes para asignaturas
 */
export const DATA_ATTRIBUTES = {
  /**
   * Algunos atributos que Banner puede usar en asignaturas
   */
  subjectId: 'data-subject-id',
  subjectNRC: 'data-nrc',
  subjectCode: 'data-subject-code',
  periodCode: 'data-period-code',
  
  /**
   * Endpoints para peticiones AJAX (según lo visto en HTML)
   */
  sectionDetailsEndpoint: 'data-endpoint="/StudentRegistrationSsb/ssb/searchResults/getSectionCatalogDetails"',
};

/**
 * Constantes para validación durante tests
 */
export const VALIDATION = {
  /**
   * Patrones regex para validar contenido
   */
  periodFormat: /\d{6}/, // 202610, 202520, etc
  periodLabel: /[A-Z]{3}-[A-Z]{3}\s+\d{4}/i, // ENE-ABR 2026
  nrcFormat: /^\d{5}$/, // 5 dígitos
  emailFormat: /@unapec\.edu\.do$/i, // Email institucional
  displayNameFormat: /^[A-Z]\./, // Inicial de nombre

  /**
   * Textos esperados en interfaz
   */
  successIndicators: ['horario', 'schedule', 'clase', 'class', 'asignatura', 'course'],
  errorIndicators: ['error', 'inválid', 'no encontr', 'not found', 'timeout', 'unable'],
};
