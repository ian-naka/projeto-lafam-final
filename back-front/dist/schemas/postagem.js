"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postagemSchema = void 0;
const zod_1 = require("zod");
const categoria_1 = require("./categoria");
const htmlTagRegex = /<[^>]*>?/g;
const sanitizeStringText = zod_1.z
    .string()
    .transform((val) => val.trim())
    .refine((val) => !htmlTagRegex.test(val), {
    message: 'tags html ou scripts não são permitidos neste campo.',
});
const coordenadasRegex = /^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/;
exports.postagemSchema = zod_1.z
    .object({
    titulo: zod_1.z.string().min(3, 'O título é obrigatório.'),
    slug: zod_1.z
        .string()
        .min(3, 'O link (slug) é obrigatório.')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'O slug deve conter apenas letras minúsculas, números e hifens.'),
    resumo: sanitizeStringText.refine((val) => val.length <= 500, 'O resumo não pode ultrapassar 500 caracteres.'),
    descricao: sanitizeStringText.refine((val) => val.length >= 10, 'A descrição é obrigatória (mín. 10 caracteres).'),
    categoria: zod_1.z.enum(categoria_1.categoriasDisponiveis),
    tags: zod_1.z.string().optional(),
    localidade: zod_1.z.string().min(3, 'A localidade é obrigatória.'),
    latitude: zod_1.z.string().optional(),
    longitude: zod_1.z.string().optional(),
    coordenadas: zod_1.z
        .union([
        zod_1.z.string().regex(coordenadasRegex, "As coordenadas devem estar no formato numérico: 'latitude, longitude' (ex: -21.7664, -43.3444)"),
        zod_1.z.literal(''),
    ])
        .optional(),
    citacao: zod_1.z.string().optional(),
    thumb: zod_1.z.string().min(1, 'A imagem de capa (Google Drive ID) é obrigatória.'),
    galeria: zod_1.z.array(zod_1.z.string()).min(1, 'Selecione pelo menos uma imagem para a galeria.'),
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
