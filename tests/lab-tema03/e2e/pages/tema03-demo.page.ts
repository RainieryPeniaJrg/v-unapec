import { expect, Page } from '@playwright/test';

export class Tema03DemoPage {
  constructor(private readonly page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await expect(this.page.getByTestId('login-title')).toHaveText('Tema 03 Demo');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username-input').fill(username);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('login-btn').click();
  }

  async ejecutarAccion(): Promise<void> {
    await this.page.getByTestId('accion-btn').click();
  }

  async logout(): Promise<void> {
    await this.page.getByTestId('logout-btn').click();
  }

  async estadoAutenticadoDebeSerVisible(): Promise<void> {
    await expect(this.page.getByTestId('estado')).toContainText('Autenticado');
  }

  async estadoAccionDebeSerVisible(): Promise<void> {
    await expect(this.page.getByTestId('accion-estado')).toContainText('Accion completada');
  }

  async estadoSesionCerradaDebeSerVisible(): Promise<void> {
    await expect(this.page.getByTestId('estado')).toContainText('Sesion cerrada');
  }

  async errorCredencialesDebeSerVisible(): Promise<void> {
    await expect(this.page.getByTestId('login-error')).toContainText('Credenciales invalidas');
  }
}
