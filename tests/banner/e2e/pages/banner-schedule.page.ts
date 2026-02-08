import { expect, Locator, Page } from '@playwright/test';

export class BannerSchedulePage {
  constructor(private readonly page: Page) {}

  async assertScheduleVisible(): Promise<void> {
    const lookupTab = this.page.locator('#lookupSchedule-tab');
    if (await lookupTab.isVisible().catch(() => false)) {
      await lookupTab.click();
    }

    const lookupFilter = this.page.locator('#lookupFilter');
    if (await lookupFilter.isVisible().catch(() => false)) {
      const selected = await lookupFilter.inputValue();
      if (!selected) {
        const options = await lookupFilter.locator('option').count();
        if (options > 0) {
          await lookupFilter.selectOption({ index: 0 });
        }
      }
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
}
