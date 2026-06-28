import { extrairLatitudeLongitude, montarCoordenadas } from './coordenadas';
import type { DadosFormularioPostagem } from '../componentes/FormularioPostagem';
import type { PostagemDetalhe, PostagemPayload } from '@lafam/back-front';

export const formularioPostagemInicial: DadosFormularioPostagem = {
  titulo: '',
  slug: '',
  resumo: '',
  descricao: '',
  categoria: 'Flora',
  localidade: '',
  tags: '',
  latitude: '',
  longitude: '',
  citacao: '',
  thumb: '',
  galeria: [],
};

export function slugificar(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function montarPayloadPostagem(formulario: DadosFormularioPostagem): PostagemPayload {
  return {
    titulo: formulario.titulo.trim(),
    slug: formulario.slug.trim(),
    resumo: formulario.resumo.trim(),
    descricao: formulario.descricao.trim(),
    categoria: formulario.categoria,
    tags: formulario.tags.trim(),
    localidade: formulario.localidade.trim(),
    latitude: formulario.latitude.trim(),
    longitude: formulario.longitude.trim(),
    coordenadas: montarCoordenadas(formulario.latitude, formulario.longitude),
    citacao: formulario.citacao.trim(),
    thumb: formulario.thumb,
    galeria: formulario.galeria,
  };
}

export function montarFormularioAPartirDaPostagem(postagem: PostagemDetalhe): DadosFormularioPostagem {
  const { latitude, longitude } = extrairLatitudeLongitude(postagem.coordenadas);

  return {
    titulo: postagem.titulo,
    slug: postagem.slug,
    resumo: postagem.resumo,
    descricao: postagem.descricao,
    categoria: postagem.categoria,
    localidade: postagem.localidade,
    tags: postagem.tags || '',
    latitude,
    longitude,
    citacao: postagem.citacao || '',
    thumb: postagem.thumb,
    galeria: postagem.galeria || [],
  };
}
