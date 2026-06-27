export interface PostagemResumo {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  thumb: string;
  categoria: string;
}

export interface PostagemDetalhe extends PostagemResumo {
  descricao: string;
  galeria?: string[];
  tags?: string;
  localidade: string;
  coordenadas?: string;
  latitude?: string;
  longitude?: string;
  citacao?: string;
}
