export type EstadoUsuario = 'activa' | 'inactiva';

export class RepoUsuarios {
  private readonly data: Record<string, EstadoUsuario> = {
    ana: 'activa',
    luis: 'inactiva',
  };

  estado(usuario: string): EstadoUsuario | undefined {
    return this.data[usuario];
  }
}
