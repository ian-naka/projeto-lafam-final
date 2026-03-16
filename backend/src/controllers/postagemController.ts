import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import Registro from '../models/Registro';
import sharp from 'sharp';
import path from 'path';

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
    categoria: z.enum(['Flora', 'Funga', 'Biomas', 'Arqueologia', 'Fauna']),
    tags: z.string().optional(),
    localidade: z.string().min(3, "A localidade é obrigatória."),
    coordenadas: z.union([
        z.string().regex(coordenadasRegex, "As coordenadas devem estar no formato numérico: 'latitude, longitude' (ex: -21.7664, -43.3444)"),
        z.literal("")
    ]).optional()
});

export default class postagemController {

    //criar um novo registro
    static async criar(req: Request, res: Response): Promise<void> {
        try {
            //valida os dados textuais que vieram do frontend
            const dadosValidados = postagemSchema.parse(req.body);

            // processa buffers de imagem usando multer memoryStorage
            let thumbPath = '';
            let galeriaPaths: string[] = [];
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            // thumbnail (obrigatória)
            if (files && files['thumbFile'] && files['thumbFile'][0]) {
                const thumbFile = files['thumbFile'][0];
                const filename = `thumb-${Date.now()}.webp`;
                const filepath = path.join(__dirname, '../../public/uploads', filename);
                
                await sharp(thumbFile.buffer)
                    .resize(1920, 1080, { fit: 'inside' })
                    .webp({ quality: 80 })
                    .toFile(filepath);
                
                thumbPath = `/uploads/${filename}`;
            } else {
                res.status(422).json({ message: 'A imagem de capa (thumbnail) é obrigatória.' });
                return;
            }

            // galeria (opcional, array de imagens)
            if (files && files['galeriaFiles']) {
                for (let i = 0; i < files['galeriaFiles'].length; i++) {
                    const file = files['galeriaFiles'][i];
                    const filename = `galeria-${Date.now()}-${i}.webp`;
                    const filepath = path.join(__dirname, '../../public/uploads', filename);
                    
                    await sharp(file.buffer)
                        .resize(1920, 1080, { fit: 'inside' })
                        .webp({ quality: 80 })
                        .toFile(filepath);
                    
                    galeriaPaths.push(`/uploads/${filename}`);
                }
            }

            // verifica se o URL já está sendo utilizado
            const slugExiste = await Registro.findOne({ where: { slug: dadosValidados.slug } });
            if (slugExiste) {
                res.status(422).json({ message: 'Este link (slug) já está em uso. Escolha outro.' });
                return;
            }

            // junta dados do formulário com caminhos dos arquivos físicos
            const payloadCompleto = {
                ...dadosValidados,
                thumb: thumbPath,
                galeria: galeriaPaths
            };

            // salva no banco de dados
            const novoRegistro = await Registro.create(payloadCompleto);

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

    // buscar registro público por slug
    static async buscarPorSlug(req: Request, res: Response): Promise<void> {
        try {
            const { slug } = req.params;
            
            const registro = await Registro.findOne({ where: { slug } });
            
            if (!registro) {
                res.status(404).json({ message: 'Registro não encontrado.' });
                return;
            }

            res.status(200).json(registro);
        } catch (error) {
            console.error("ERRO AO BUSCAR REGISTRO POR SLUG:", error);
            res.status(500).json({ message: 'Erro interno ao buscar o registro.' });
        }
    }
}