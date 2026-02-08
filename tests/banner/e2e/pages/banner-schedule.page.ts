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

    await this.scrollContainer('#lookupSchedule-wrapper');
    await this.scrollContainer('#scheduleCalendar');
  }

  async countSubjectsByNrc(): Promise<number> {
    const nrCs = new Set<string>();
    const byPriority = [
      this.page.locator('#lookupScheduleTable .slick-row'),
      this.page.locator('#lookupScheduleTable [role="row"]'),
      this.page.locator('#scheduleListView .listViewItem'),
      this.page.locator('#scheduleListView [role="row"]'),
      this.page.locator('table tbody tr'),
    ];

    for (const rows of byPriority) {
      const rowCount = await rows.count();
      if (!rowCount) {
        continue;
      }

      const texts = await rows.evaluateAll((nodes) =>
        nodes.map((node) => (node.textContent || '').replace(/\s+/g, ' ').trim()),
      );

      for (const text of texts) {
        const nrcFromLabel = text.match(/NRC[:\s]*([0-9]{4,6})/i)?.[1];
        const nrcFromDigits = text.match(/\b([0-9]{5})\b/)?.[1];
        const raw = nrcFromLabel || nrcFromDigits;
        if (raw) {
          nrCs.add(raw.replace(/\D/g, ''));
        }
      }
    }

    if (nrCs.size > 0) {
      return nrCs.size;
    }

    const fallbackRows = [
      this.page.locator('#lookupScheduleTable .slick-row'),
      this.page.locator('#scheduleListView .listViewItem'),
      this.page.locator('table tbody tr'),
    ];

    for (const locator of fallbackRows) {
      const count = await locator.count();
      if (count > 0) {
        return count;
      }
    }

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
