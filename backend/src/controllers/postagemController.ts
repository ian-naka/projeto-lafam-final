import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import Registro from '../models/Registro';

// regex para detectar qualquer presença de tags html
const htmlTagRegex = /<[^>]*>?/g;

// utilitário do zod para garantir que strings longas não contenham tags e remover espaços excessivos
const sanitizeStringText = z.string().transform((val) => val.trim()).refine((val) => !htmlTagRegex.test(val), {
  message: "tags html ou scripts não são permitidos neste campo."
});

// regex para validação estrita de coordenadas: "lat, lng" aceitando apenas números, ponto, vírgula, espaço e sinal de menos
const coordenadasRegex = /^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/;

//definindo as regras de validação para a criação do registro
const postagemSchema = z.object({
    titulo: z.string().min(3, "O título é obrigatório."),
    slug: z.string().min(3, "O link (slug) é obrigatório.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O slug deve conter apenas letras minúsculas, números e hifens."),
    resumo: sanitizeStringText.refine(val => val.length <= 500, "O resumo não pode ultrapassar 500 caracteres."),
    descricao: sanitizeStringText.refine(val => val.length >= 10, "A descrição é obrigatória (mín. 10 caracteres)."),
    
    //regra estrita: a thumbnail deve ser obrigatoriamente um link do Google Drive
    thumb: z.string().url().refine((url) => url.includes('drive.google.com') || url.includes('docs.google.com'), {
        message: "A imagem da thumbnail deve ser obrigatoriamente um link do Google Drive."
    }),
    
    //regra estrita: array de imagens que devem ser oriundas do Google Drive
    galeria: z.array(
        z.string().refine((urlOuId) => urlOuId.includes('drive.google.com') || urlOuId.length > 25, {
            message: "Os itens da galeria devem ser links ou IDs válidos do Google Drive."
        })
    ).optional(),
    
    categoria: z.enum(['Flora', 'Funga', 'Biomas', 'Arqueologia', 'Fauna']),
    tags: z.string().optional(),
    localidade: z.string().min(3, "A localidade é obrigatória."),
    coordenadas: z.string().regex(coordenadasRegex, "As coordenadas devem estar no formato numérico: 'latitude, longitude' (ex: -21.7664, -43.3444)").optional()
});

export default class postagemController {

    //criar um novo registro
    static async criar(req: Request, res: Response): Promise<void> {
        try {
            //valida os dados que vieram do frontend
            const dadosValidados = postagemSchema.parse(req.body);

            //verifica se o URL já está sendo utilizado
            const slugExiste = await Registro.findOne({ where: { slug: dadosValidados.slug } });
            if (slugExiste) {
                res.status(422).json({ message: 'Este link (slug) já está em uso. Escolha outro.' });
                return;
            }

            //salva no banco de dados
            const novoRegistro = await Registro.create(dadosValidados);

            res.status(201).json({ 
                message: 'Registro criado com sucesso!', 
                registro: novoRegistro 
            });

        } catch (error: any) {
            console.error("ERRO AO CRIAR REGISTRO:", error);
            if (error instanceof ZodError) {
                res.status(422).json({ 
                    message: "Dados inválidos", 
                    errors: error.issues.map((issue) => issue.message) 
                });
                return;
            }
            res.status(500).json({ message: 'Erro interno ao salvar o registro.' });
        }
    }
}