import { expect, Page } from '@playwright/test';

const registrationUrl = 'https://registro.unapec.edu.do/StudentRegistrationSsb/ssb/registration';
const registrationHistoryUrl = 'https://registro.unapec.edu.do/StudentRegistrationSsb/ssb/registrationHistory/registrationHistory';

export class BannerHomePage {
  constructor(private readonly page: Page) {}

  async assertAuthenticated(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    const authenticatedSignals = [
      this.page.locator('#landingPathMenu'),
      this.page.locator('#registerLink'),
      this.page.getByRole('button', { name: /profile|account|user|cuenta/i }),
      this.page.getByRole('link', { name: /Student|Registration|Profile/i }),
      this.page.getByText(/Student Self-Service|Registration/i),
    ];

    const visible = await Promise.all(
      authenticatedSignals.map((l) => l.first().isVisible().catch(() => false)),
    );

    const url = this.page.url();
    const urlLooksAuthenticated = /StudentSelfService|registro\.unapec\.edu\.do|sso\.unapec\.edu\.do/i.test(url);
    expect(visible.some(Boolean) || urlLooksAuthenticated).toBeTruthy();
  }

  async getDisplayName(usernameFallback: string): Promise<string> {
    const metaFullName = this.page.locator('meta[name="fullName"]');
    if (await metaFullName.count()) {
      const metaValue = (await metaFullName.first().getAttribute('content'))?.trim();
      if (metaValue) {
        return metaValue;
      }
    }

    const candidateLocators = [
      this.page.locator('[data-property=\"displayName\"]'),
      this.page.locator('[aria-label*=\"Account\"]'),
      this.page.locator('.user-name, .username'),
    ];

    for (const locator of candidateLocators) {
      const item = locator.first();
      if (await item.isVisible().catch(() => false)) {
        const text = ((await item.textContent()) || '').trim();
        if (text) {
          return text;
        }
      }
    }

    return usernameFallback;
  }

  async gotoClassSchedule(): Promise<void> {
    await this.page.goto(registrationUrl, { waitUntil: 'domcontentloaded' });
    const historyLink = this.page.locator('#regHistoryLink');
    if (await historyLink.isVisible().catch(() => false)) {
      await historyLink.click();
      await this.page.waitForURL(/registrationHistory\/registrationHistory/i, { timeout: 60_000 });
      return;
    }

    await this.page.goto(registrationHistoryUrl, { waitUntil: 'domcontentloaded' });
  }

  async logout(): Promise<void> {
    const logoutActions = [
      this.page.getByRole('button', { name: /Salir/i }),
      this.page.getByRole('link', { name: /Salir/i }),
      this.page.getByRole('button', { name: /Log Out|Logout|Sign out|Cerrar sesion/i }),
      this.page.getByRole('link', { name: /Log Out|Logout|Sign out|Cerrar sesion/i }),
      this.page.getByText(/Log Out|Logout|Sign out|Cerrar sesion/i),
    ];

    for (const action of logoutActions) {
      const target = action.first();
      if (await target.isVisible().catch(() => false)) {
        await target.click();
        await this.page.waitForLoadState('domcontentloaded');
        return;
      }
    }

    await this.page.goto('https://alumnos.unapec.edu.do/StudentSelfService', { waitUntil: 'domcontentloaded' });
  }

  async assertLoggedOut(): Promise<void> {
    const url = this.page.url();
    const urlLooksLoggedOut = /login\.microsoftonline\.com|landing\.unapec\.edu\.do\/banner/i.test(url);
    const loginFieldVisible = await this.page.locator('#i0116, input[name=\"loginfmt\"]').isVisible().catch(() => false);
    expect(urlLooksLoggedOut || loginFieldVisible).toBeTruthy();
  }
}
