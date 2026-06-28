import { z } from 'zod';
import { categoriasDisponiveis, type CategoriaDisponivel } from './categoria';

const htmlTagRegex = /<[^>]*>?/g;

const sanitizeStringText = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => !htmlTagRegex.test(val), {
    message: 'tags html ou scripts não são permitidos neste campo.',
  });

const coordenadasRegex = /^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/;

export const postagemSchema = z
  .object({
    titulo: z.string().min(3, 'O título é obrigatório.'),
    slug: z
      .string()
      .min(3, 'O link (slug) é obrigatório.')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'O slug deve conter apenas letras minúsculas, números e hifens.'),
    resumo: sanitizeStringText.refine((val) => val.length <= 500, 'O resumo não pode ultrapassar 500 caracteres.'),
    descricao: sanitizeStringText.refine((val) => val.length >= 10, 'A descrição é obrigatória (mín. 10 caracteres).'),
    categoria: z.enum(categoriasDisponiveis),
    tags: z.string().optional(),
    localidade: z.string().min(3, 'A localidade é obrigatória.'),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    coordenadas: z
      .union([
        z.string().regex(coordenadasRegex, "As coordenadas devem estar no formato numérico: 'latitude, longitude' (ex: -21.7664, -43.3444)"),
        z.literal(''),
      ])
      .optional(),
    citacao: z.string().optional(),
    thumb: z.string().min(1, 'A imagem de capa (Google Drive ID) é obrigatória.'),
    galeria: z.array(z.string()).min(1, 'Selecione pelo menos uma imagem para a galeria.'),
  })
  .superRefine((dados, context) => {
    if ((!dados.latitude || !dados.longitude) && !dados.coordenadas) {
      context.addIssue({
        code: 'custom',
        path: ['coordenadas'],
        message: 'Informe latitude e longitude.',
      });
    }
  });

export type PostagemPayload = z.infer<typeof postagemSchema>;

export type PostagemResumo = {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  thumb: string;
  categoria: CategoriaDisponivel;
};

export type PostagemDetalhe = PostagemResumo & {
  descricao: string;
  galeria?: string[];
  tags?: string;
  localidade: string;
  coordenadas?: string;
  latitude?: string;
  longitude?: string;
  citacao?: string;
};

export type ListarPostagensParams = {
  categoria?: string;
  pagina?: number;
  limit?: number;
};

export type RespostaListaPostagens = {
  registros: PostagemResumo[];
  total: number;
  paginaAtual: number;
  totalPaginas: number;
};

export type PostagemMutationResponse = {
  message: string;
  registro: PostagemDetalhe;
};

export type MensagemResponse = {
  message: string;
};
