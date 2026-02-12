import { expect, Locator, Page } from '@playwright/test';
import { buildScreenshotPath } from '../utils/banner-log';

type PeriodSelectionResult = {
  selectedValue: string;
  selectedLabel: string;
  usedFallback: boolean;
};

type ScheduleEvidence = {
  wrapperPath: string;
  calendarPath: string;
};

export class BannerSchedulePage {
  constructor(private readonly page: Page) {}

  async assertScheduleVisible(): Promise<void> {
    const lookupTab = this.page.locator('#lookupSchedule-tab');
    if (await lookupTab.isVisible().catch(() => false)) {
      await lookupTab.click();
    }

    await this.page.waitForLoadState('networkidle');
    const signals = [
      this.page.locator('#lookupScheduleTable'),
      this.page.locator('#scheduleListView'),
      this.page.getByText(/Horario de clase|Class Schedule|Buscar un horario/i),
      this.page.getByText(/Class Schedule|Horario|Schedule/i),
      this.page.getByRole('heading', { name: /Class Schedule|Horario/i }),
      this.page.locator('table'),
    ];

    const visible = await Promise.all(signals.map((s) => s.first().isVisible().catch(() => false)));
    expect(visible.some(Boolean)).toBeTruthy();
  }

  async selectTargetPeriod(): Promise<PeriodSelectionResult> {
    const lookupFilter = this.page.locator('#lookupFilter');
    await expect(lookupFilter).toHaveCount(1, { timeout: 30_000 });

    const options = await lookupFilter.locator('option').evaluateAll((nodes) =>
      nodes.map((node) => ({
        value: (node as HTMLOptionElement).value,
        label: (node.textContent || '').trim(),
      })),
    );

    const currentValue = await lookupFilter.inputValue();
    const currentLabel = options.find((o) => o.value === currentValue)?.label ?? currentValue;

    const target = options.find(
      (option) => option.value === '202610' || /ENE-ABR\s+2026\s+GRADO/i.test(option.label),
    );

    if (target) {
      const isVisible = await lookupFilter.isVisible().catch(() => false);
      if (isVisible) {
        await lookupFilter.selectOption(target.value);
      } else {
        await this.page.evaluate((value) => {
          const select = document.querySelector('#lookupFilter') as HTMLSelectElement | null;
          if (!select) {
            return;
          }

          select.value = value;
          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }, target.value);
      }

      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(800);
      return {
        selectedValue: target.value,
        selectedLabel: target.label,
        usedFallback: false,
      };
    }

    return {
      selectedValue: currentValue,
      selectedLabel: currentLabel,
      usedFallback: true,
    };
  }

  async ensureSchedulePanelsVisibleAndScrolled(): Promise<void> {
    const lookupTab = this.page.locator('#lookupSchedule-tab');
    if (await lookupTab.isVisible().catch(() => false)) {
      await lookupTab.click();
    }

    // ⏳ PASO CRÍTICO: Esperar a que la tabla se cargue
    // #lookupScheduleTable puede estar vacío inicialmente
    await this.page.waitForLoadState('networkidle');
    
    // Esperar explícitamente a que la tabla tenga datos (primeras filas visibles)
    try {
      await this.page.waitForSelector('a.section-details-link', { timeout: 15000 });
    } catch (e) {
      // Si no hay tabla con .section-details-link, intentar otros selectores
      try {
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });
      } catch (e2) {
        // Continuar de todas formas, el conteo usará fallbacks
      }
    }

    // Scroll en contenedores para asegurar que todo esté cargado
    await this.scrollContainer('#lookupSchedule-wrapper');
    await this.scrollContainer('#scheduleCalendar');
    
    // Pausa final para que se estabilice
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(800);
  }

  async countSubjectsByNrc(): Promise<number> {
    const detailsTab = this.page.locator('#scheduleDetailsViewLink');
    if (await detailsTab.isVisible().catch(() => false)) {
      await detailsTab.click();
      await this.page.waitForTimeout(700);
    }

    // ⏳ ESPERA CRÍTICA: Tabla se carga dinámicamente via AJAX
    // Esperar que la tabla tenga contenido (filas con asignaturas)
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1500); // Pausa extra para AJAX
    
    // Verificar que el contenedor tenga datos antes de contar
    try {
      await this.page.locator('a.section-details-link').first().waitFor({ timeout: 10000 });
    } catch (e) {
      // Si no hay elementos con ese selector, continuar con fallbacks
    }

    // Intento 1: CSS directo - contar todos los links de asignatura
    // HTML esperado: <a class="section-details-link">DISEÑO WEB</a>
    let count = await this.page.locator('a.section-details-link').count();
    if (count > 0) {
      return count;
    }

    // Intento 2: XPath robusto (Tabla con tbody -> tr -> td -> a)
    // Estructura: #lookupScheduleTable -> table -> tbody -> tr -> td -> a.section-details-link
    const xpathCount = await this.page.locator("xpath=//a[@class='section-details-link']").count();
    if (xpathCount > 0) {
      return xpathCount;
    }

    // Intento 3: Contar por tabla (filas = asignaturas)
    // Si hay tabla dentro de #lookupScheduleTable
    const tableRows = await this.page.locator('#lookupScheduleTable table tbody tr').count();
    if (tableRows > 0) {
      return tableRows;
    }

    // Intento 4: Contar filas independientemente del contenedor
    const allTableRows = await this.page.locator('table tbody tr').count();
    if (allTableRows > 0) {
      return allTableRows;
    }

    // Intento 5: Conteo por divs del horario (si usa lista en lugar de tabla)
    const divLocators = [
      this.page.locator('#scheduleListView .listViewItem'),
      this.page.locator('#scheduleListView .classDetailsDiv'),
      this.page.locator('#lookupScheduleTable [role="row"]'),
      this.page.locator('#lookupScheduleTable .slick-row'),
    ];

    for (const locator of divLocators) {
      const divCount = await locator.count();
      if (divCount > 0) {
        return divCount;
      }
    }

    // Intento 6: Búsqueda por contenido (divs con "NRC" visible)
    const nrcByContent = await this.page.evaluate(() => {
      // Buscar en #scheduleListView primero
      let scope = document.querySelector('#scheduleListView');
      
      // Fallback: buscar en #lookupScheduleTable
      if (!scope || (scope as HTMLElement).innerText.length === 0) {
        scope = document.querySelector('#lookupScheduleTable');
      }

      if (!scope) {
        return 0;
      }

      // Contar elementos visibles que contengan "NRC"
      const elements = scope.querySelectorAll('*');
      const nrcElements = Array.from(elements).filter((el) => {
        const style = window.getComputedStyle(el as HTMLElement);
        const isVisible =
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          (el as HTMLElement).offsetHeight > 0;

        const hasNRC = /NRC/i.test(el.textContent || '');
        return isVisible && hasNRC;
      });

      // Contar elementos únicos (deduplicar por texto)
      const uniqueNRC = new Set(nrcElements.map((el) => (el.textContent || '').trim()));
      return uniqueNRC.size;
    });

    if (nrcByContent > 0) {
      return nrcByContent;
    }

    // Fallback final: retornar 0 pero loguear para debugging
    return 0;
  }

  async captureScheduleEvidence(): Promise<ScheduleEvidence> {
    const wrapperPath = buildScreenshotPath('lookup-wrapper');
    const calendarPath = buildScreenshotPath('schedule-calendar');

    const wrapper = this.page.locator('#lookupSchedule-wrapper');
    const calendar = this.page.locator('#scheduleCalendar');

    if (await wrapper.isVisible().catch(() => false)) {
      await wrapper.screenshot({ path: wrapperPath });
    } else {
      await this.page.locator('main').first().screenshot({ path: wrapperPath });
    }

    if (await calendar.isVisible().catch(() => false)) {
      await calendar.screenshot({ path: calendarPath });
    } else {
      await this.page.locator('body').screenshot({ path: calendarPath, fullPage: true });
    }

    return { wrapperPath, calendarPath };
  }

  async countSubjects(): Promise<number> {
    const priorityLocators = [
      this.page.locator('#lookupScheduleTable .slick-row'),
      this.page.locator('#lookupScheduleTable [role="row"]'),
      this.page.locator('#scheduleListView .listViewItem'),
      this.page.locator('#scheduleListView [role="row"]'),
      this.page.locator('table tbody tr'),
    ];

    for (const locator of priorityLocators) {
      const count = await locator.count();
      if (count > 0) {
        return count;
      }
    }

    const fallbackLocators = [
      this.page.locator('[class*=\"course\"]'),
      this.page.locator('[class*=\"subject\"]'),
      this.page.locator('[class*=\"schedule\"] [role=\"row\"]'),
    ];

    for (const locator of fallbackLocators) {
      const count = await locator.count();
      if (count > 0) {
        return count;
      }
    }

    return 0;
  }

  async screenshotSchedule(outputPath: string): Promise<void> {
    const target = await this.bestContainer();
    await target.screenshot({ path: outputPath });
  }

  private async bestContainer(): Promise<Locator> {
    const candidates = [
      this.page.locator('#lookupSchedule-wrapper').first(),
      this.page.locator('#scheduleCalendar').first(),
      this.page.locator('#tabs-lookupSchedule').first(),
      this.page.locator('table').first(),
      this.page.locator('main').first(),
      this.page.locator('body'),
    ];

    for (const candidate of candidates) {
      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
    }

    return this.page.locator('body');
  }

  private async scrollContainer(selector: string): Promise<void> {
    const container = this.page.locator(selector).first();
    if (!(await container.isVisible().catch(() => false))) {
      return;
    }

    await container.evaluate((node) => {
      const element = node as HTMLElement;
      element.scrollTop = element.scrollHeight;
    });
    await this.page.waitForTimeout(250);
    await container.evaluate((node) => {
      const element = node as HTMLElement;
      element.scrollTop = 0;
    });
  }
}
