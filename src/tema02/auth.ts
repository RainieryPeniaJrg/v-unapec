import { RepoUsuarios } from './repositorio';

export class AuthService {
  constructor(private readonly repo: RepoUsuarios) {}

  puedeLogin(usuario: string, passwordOk: boolean): boolean {
    return this.repo.estado(usuario) === 'activa' && passwordOk;
  }
}
