export function obterToken(): string | null {
  return localStorage.getItem('token');
}

export function usuarioEstaAutenticado(): boolean {
  return Boolean(obterToken());
}

export function encerrarSessao(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('adminId');
}
