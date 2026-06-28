import * as contratosLafam from '@lafam/back-front';
import type { Categoria, RespostaListaCategorias } from '@lafam/back-front';
import { montarUrlApi } from './api';

const { categoriasPadrao } = contratosLafam;

export async function listarCategorias(): Promise<Categoria[]> {
  try {
    const resposta = await fetch(montarUrlApi('/categorias'));
    const dados = await resposta.json() as RespostaListaCategorias;
    return dados.categorias || categoriasPadrao;
  } catch (error) {
    console.error(error);
    return categoriasPadrao;
  }
}
