import { expect, Page } from '@playwright/test';
import { buildScreenshotPath } from '../utils/banner-log';

export class BannerLoginPage {
  constructor(private readonly page: Page) {}

  async gotoLanding(): Promise<void> {
    await this.page.goto('https://landing.unapec.edu.do/banner/', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveTitle(/BANNER UNAPEC/i);
  }

  async openBannerPortal(): Promise<void> {
    const studentAccessLink = this.page.getByRole('link', { name: /Acceso para estudiantes/i });
    await expect(studentAccessLink).toBeVisible();

    const href = await studentAccessLink.getAttribute('href');
    if (href) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    } else {
      await studentAccessLink.click();
    }

    await this.page.waitForURL(/login\.microsoftonline\.com|StudentSelfService|registro\.unapec\.edu\.do|alumnos\.unapec\.edu\.do/i, {
      timeout: 60_000,
    });
    await this.captureStep('login-page-loaded');
  }

  async login(username: string, password: string): Promise<void> {
    const useAnotherAccount = this.page.getByText(/Use another account|Usar otra cuenta/i);
    if (await useAnotherAccount.isVisible().catch(() => false)) {
      await useAnotherAccount.click();
    }

    const emailInput = this.page.locator('#i0116, input[name=\"loginfmt\"]');
    await expect(emailInput).toBeVisible({ timeout: 30_000 });
    await emailInput.fill(username);
    await this.captureStep('email-filled');
    await this.page.locator('#idSIButton9, input[type=\"submit\"][value=\"Next\"]').first().click();

    const passwordInput = this.page.locator('#i0118, input[name=\"passwd\"]');
    await expect(passwordInput).toBeVisible({ timeout: 30_000 });
    await this.captureStep('password-page-loaded');
    await passwordInput.fill(password);
    await this.captureStep('password-filled');
    await this.page.locator('#idSIButton9, input[type=\"submit\"][value=\"Sign in\"]').first().click();

    await this.captureStep('after-submit');
    await this.handleStaySignedInPrompt();
    await this.page.waitForURL(/alumnos\.unapec\.edu\.do|registro\.unapec\.edu\.do|StudentSelfService/i, {
      timeout: 90_000,
    });
  }

  async assertLoginErrorVisible(): Promise<void> {
    const errorLocators = [
      this.page.locator('#passwordError'),
      this.page.locator('#errorText'),
      this.page.getByText(/incorrect|invalid|wrong password|cuenta o contrasena/i),
    ];

    let found = false;
    for (const locator of errorLocators) {
      if (await locator.first().isVisible().catch(() => false)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();
  }

  private async handleStaySignedInPrompt(): Promise<void> {
    const noButton = this.page.locator('#idBtn_Back');
    if (await noButton.isVisible().catch(() => false)) {
      await noButton.click();
      return;
    }

    const staySignedQuestion = this.page.getByText(/Stay signed in\?|Mantener la sesion iniciada/i);
    if (await staySignedQuestion.isVisible().catch(() => false)) {
      await this.page.locator('#idSIButton9').click();
    }
  }

  private async captureStep(label: string): Promise<void> {
    const path = buildScreenshotPath(label);
    await this.page.screenshot({ path, fullPage: true });
  }
}
