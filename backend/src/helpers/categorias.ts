export const categoriasDisponiveis = [
  'Flora',
  'Funga',
  'Biomas',
  'Arqueologia',
  'Fauna',
] as const;

export type CategoriaDisponivel = (typeof categoriasDisponiveis)[number];

export function formatarSlugCategoria(categoria: string): string {
  return categoria.toLowerCase();
}

export function formatarCategoriaDaUrl(categoria: string): string {
  return categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
}

export function categoriaEhValida(categoria: string): categoria is CategoriaDisponivel {
  return categoriasDisponiveis.includes(categoria as CategoriaDisponivel);
}
