import type { Categoria } from '../tipos/categoria';
import { montarUrlApi } from './api';

const categoriasPadrao: Categoria[] = [
  { nome: 'Flora', slug: 'flora' },
  { nome: 'Funga', slug: 'funga' },
  { nome: 'Biomas', slug: 'biomas' },
  { nome: 'Arqueologia', slug: 'arqueologia' },
  { nome: 'Fauna', slug: 'fauna' },
];

export async function listarCategorias(): Promise<Categoria[]> {
  try {
    const resposta = await fetch(montarUrlApi('/categorias'));
    const dados = await resposta.json();
    return dados.categorias || categoriasPadrao;
  } catch (error) {
    console.error(error);
    return categoriasPadrao;
  }
}
