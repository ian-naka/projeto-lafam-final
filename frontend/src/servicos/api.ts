export const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function montarUrlApi(caminho: string): string {
  return caminho.startsWith('/') ? `${URL_API}${caminho}` : `${URL_API}/${caminho}`;
}
