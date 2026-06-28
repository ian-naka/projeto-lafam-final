import type {
  ListarPostagensParams,
  MensagemResponse,
  PostagemDetalhe,
  PostagemMutationResponse,
  PostagemPayload,
  RespostaListaPostagens,
} from '@lafam/back-front';
import { montarUrlApi } from './api';

export async function listarPostagens(params?: ListarPostagensParams): Promise<RespostaListaPostagens> {
  const searchParams = new URLSearchParams();

  if (params?.categoria) searchParams.set('categoria', params.categoria);
  searchParams.set('pagina', String(params?.pagina || 1));
  searchParams.set('limit', String(params?.limit || 50));

  const resposta = await fetch(montarUrlApi(`/postagens?${searchParams.toString()}`));
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'Erro ao listar postagens.');
  }

  return dados;
}

export async function buscarPostagemPorSlug(slug: string): Promise<PostagemDetalhe> {
  const resposta = await fetch(montarUrlApi(`/postagens/${slug}`));
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'Erro ao buscar postagem.');
  }

  return dados;
}

export async function criarPostagem(payload: PostagemPayload, token: string): Promise<PostagemMutationResponse> {
  const resposta = await fetch(montarUrlApi('/postagens'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    const mensagem = Array.isArray(dados.errors) ? dados.errors.join(' | ') : (dados.message || 'Erro ao criar postagem.');
    throw new Error(mensagem);
  }

  return dados;
}

export async function atualizarPostagem(id: number, payload: PostagemPayload, token: string): Promise<PostagemMutationResponse> {
  const resposta = await fetch(montarUrlApi(`/postagens/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    const mensagem = Array.isArray(dados.errors) ? dados.errors.join(' | ') : (dados.message || 'Erro ao atualizar postagem.');
    throw new Error(mensagem);
  }

  return dados;
}

export async function excluirPostagem(id: number, token: string): Promise<MensagemResponse> {
  const resposta = await fetch(montarUrlApi(`/postagens/${id}`), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'Erro ao excluir postagem.');
  }

  return dados;
}
