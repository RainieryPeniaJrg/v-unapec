/**
 * Datos de prueba centralizados para tests Banner E2E
 * 
 * Proporciona:
 * - Credenciales válidas/inválidas para login
 * - Códigos de período académico
 * - URLs de rutas críticas
 * 
 * Uso en tests:
 * ```typescript
 * import { BANNER_PERIODS, VALID_CREDENTIALS } from '../contexto/fixtures/banner-test-data';
 * 
 * const period = BANNER_PERIODS.ENERO_ABRIL_2026;
 * const { username, password } = VALID_CREDENTIALS.primary;
 * ```
 */

/**
 * Períodos académicos disponibles en Banner UNAPEC
 * Código: valor numérico que se envía en el select #lookupFilter
 * Etiqueta: texto mostrado en la interfaz
 */
export const BANNER_PERIODS = {
  ENERO_ABRIL_2026: {
    value: '202610',
    label: 'ENE-ABR 2026 GRADO',
    description: 'Periodo enero-abril 2026 para estudiantes de grado',
  },
  MAYO_AGOSTO_2025: {
    value: '202520',
    label: 'MAY-AGO 2025 GRADO',
    description: 'Periodo mayo-agosto 2025 para estudiantes de grado',
  },
  SEPTIEMBRE_DICIEMBRE_2025: {
    value: '202530',
    label: 'SEP-DIC 2025 GRADO',
    description: 'Periodo septiembre-diciembre 2025 para estudiantes de grado',
  },
};

/**
 * Credenciales de prueba
 * Estas provienen del archivo .env del proyecto
 */
export const VALID_CREDENTIALS = {
  primary: {
    username: process.env.BANNER_USERNAME || 'j.pena171@unapec.edu.do',
    password: process.env.BANNER_PASSWORD || 'Junapec@1',
    displayName: 'J. Peña',
  },
};

/**
 * Credenciales inválidas para tests negativos
 */
export const INVALID_CREDENTIALS = {
  wrongPassword: {
    username: VALID_CREDENTIALS.primary.username,
    password: `${VALID_CREDENTIALS.primary.password}WRONG`,
  },
  emptyUsername: {
    username: '',
    password: VALID_CREDENTIALS.primary.password,
  },
  emptyPassword: {
    username: VALID_CREDENTIALS.primary.username,
    password: '',
  },
  nonExistentUser: {
    username: 'nonexistent.user@unapec.edu.do',
    password: 'AnyPassword123',
  },
};

/**
 * URLs críticas del sitio Banner
 */
export const BANNER_URLS = {
  landing: 'https://landing.unapec.edu.do/banner/',
  registrationHistory: 'https://registro.unapec.edu.do/StudentRegistrationSsb/ssb/registrationHistory/registrationHistory',
  registration: 'https://registro.unapec.edu.do/StudentRegistrationSsb/ssb/registration',
  portal: 'https://registro.unapec.edu.do',
};

/**
 * Selectores y localizadores clave (documentados en banner-selectors.ts)
 */
export const EXPECTED_ELEMENTS = {
  // Después de login exitoso
  authenticatedIndicators: [
    '#registerLink', // Enlace a registro de clases
    '#scheduleLink', // Enlace a ver horario
    '#logoutLink', // Botón logout
    '[aria-label*="logout"]', // Cualquier elemento con logout en aria-label
  ],

  // En página de horario
  scheduleIndicators: [
    '#lookupScheduleTable', // Tabla de horario
    '#scheduleListView', // Vista de lista de horario
    '#lookupFilter', // Select de período
    'table tbody tr', // Filas de tabla con asignaturas
  ],

  // Asignaturas (después de select período)
  subjectIndicators: [
    '.section-details-link', // Link individual de asignatura
    '.slick-row', // Fila estilo Slick.js
    '[role="row"]', // Cualquier fila semántica
    '.listViewItem', // Item individual de lista
  ],
};

/**
 * Rangos esperados de datos
 */
export const EXPECTED_RANGES = {
  minSubjects: 4, // Estudiante debe tener al menos algunos cursos
  maxSubjects: 20, // Máximo razonable de cursos por período
  subjectsPerPage: 10, // Asignaturas visibles antes de scroll
};

/**
 * Timeouts específicos para acciones Banner
 * (Banner puede ser lento debido a OAuth Microsoft y red UNAPEC)
 */
export const BANNER_TIMEOUTS = {
  oauthLogin: 30000, // OAuth Microsoft puede tomar tiempo
  pageLoad: 20000, // Cargas de página general
  networkIdle: 5000, // Esperar red inactiva
  scroll: 800, // Esperar después de scroll
  screenshot: 2000, // Dar tiempo para renderizar antes de screenshot
};
