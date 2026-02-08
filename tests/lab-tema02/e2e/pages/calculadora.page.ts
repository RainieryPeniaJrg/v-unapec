import { expect, Page } from '@playwright/test';

export class CalculadoraPage {
  constructor(private readonly page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await expect(this.page.locator('#titulo')).toHaveText('Calc');
  }

  async sumar(a: string, b: string): Promise<void> {
    await this.page.fill('#a', a);
    await this.page.fill('#b', b);
    await this.page.click('#sumar');
  }

  async resultado(): Promise<string> {
    return this.page.inputValue('#res');
  }
}
