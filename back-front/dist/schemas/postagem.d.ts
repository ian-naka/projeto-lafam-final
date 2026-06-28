import { z } from 'zod';
import { type CategoriaDisponivel } from './categoria';
export declare const postagemSchema: z.ZodObject<{
    titulo: z.ZodString;
    slug: z.ZodString;
    resumo: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    descricao: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    categoria: z.ZodEnum<{
        Flora: "Flora";
        Funga: "Funga";
        Biomas: "Biomas";
        Arqueologia: "Arqueologia";
        Fauna: "Fauna";
    }>;
    tags: z.ZodOptional<z.ZodString>;
    localidade: z.ZodString;
    latitude: z.ZodOptional<z.ZodString>;
    longitude: z.ZodOptional<z.ZodString>;
    coordenadas: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>;
    citacao: z.ZodOptional<z.ZodString>;
    thumb: z.ZodString;
    galeria: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
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
