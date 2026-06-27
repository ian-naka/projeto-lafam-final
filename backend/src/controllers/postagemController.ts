import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import Registro from '../models/Registro';
import { getImagemStream, getImagemOriginalStream, preCacheImagem } from '../services/googleDriveService';
import { categoriaEhValida, categoriasDisponiveis, formatarCategoriaDaUrl } from '../helpers/categorias';

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
    categoria: z.enum(categoriasDisponiveis),
    tags: z.string().optional(),
    localidade: z.string().min(3, "A localidade é obrigatória."),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    coordenadas: z.union([
        z.string().regex(coordenadasRegex, "As coordenadas devem estar no formato numérico: 'latitude, longitude' (ex: -21.7664, -43.3444)"),
        z.literal("")
    ]).optional(),
    citacao: z.string().optional(),
    thumb: z.string().min(1, "A imagem de capa (Google Drive ID) é obrigatória."),
    galeria: z.array(z.string()).min(1, 'Selecione pelo menos uma imagem para a galeria.')
}).superRefine((dados, context) => {
    if ((!dados.latitude || !dados.longitude) && !dados.coordenadas) {
        context.addIssue({
            code: 'custom',
            path: ['coordenadas'],
            message: 'Informe latitude e longitude.'
        });
    }
});

function registroPossuiCategoria(registro: Registro, categoria: string): boolean {
    return registro.categoria === categoria;
}

function montarCoordenadas(latitude?: string, longitude?: string, coordenadas?: string): string {
    if (latitude?.trim() && longitude?.trim()) {
        return `${latitude.trim()}, ${longitude.trim()}`;
    }

    return coordenadas?.trim() || '';
}

function montarPayloadRegistro(dadosValidados: z.infer<typeof postagemSchema>) {
    const coordenadas = montarCoordenadas(
        dadosValidados.latitude,
        dadosValidados.longitude,
        dadosValidados.coordenadas
    );

    return {
        coordenadas,
        payloadRegistro: {
            ...dadosValidados,
            coordenadas,
        }
    };
}

export default class postagemController {
    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const { categoria } = req.query;
            const limit = parseInt(req.query.limit as string) || 50;
            const pagina = parseInt(req.query.pagina as string) || 1;
            const offset = (pagina - 1) * limit;           

            const registros = await Registro.findAll({
                order: [['createdAt', 'DESC']]
            });

            let registrosFiltrados = registros;

            if (typeof categoria === 'string' && categoria.trim().length > 0) {
                const categoriaFormatada = formatarCategoriaDaUrl(categoria.trim());

                if (!categoriaEhValida(categoriaFormatada)) {
                    res.status(400).json({ message: 'Categoria inválida.' });
                    return;
                }

                registrosFiltrados = registros.filter((registro) =>
                    registroPossuiCategoria(registro, categoriaFormatada)
                );
            }

            const registrosPaginados = registrosFiltrados.slice(offset, offset + limit);

            res.status(200).json({
                registros: registrosPaginados,
                total: registrosFiltrados.length,
                paginaAtual: pagina,
                totalPaginas: Math.ceil(registrosFiltrados.length / limit) || 1
            });
        } catch (error) {
            console.error("ERRO AO LISTAR POSTAGENS:", error);
            res.status(500).json({ message: 'Erro interno ao listar as postagens.' });
        }
    }

    //criar uma nova postagem
    static async criar(req: Request, res: Response): Promise<void> {
        try {
            //valida os dados textuais e os IDs do Drive que vieram do frontend via JSON
            const dadosValidados = postagemSchema.parse(req.body);
            const { payloadRegistro } = montarPayloadRegistro(dadosValidados);

            // verifica se o URL já está sendo utilizado
            const slugExiste = await Registro.findOne({ where: { slug: dadosValidados.slug } });
            if (slugExiste) {
                res.status(422).json({ message: 'Este link (slug) já está em uso. Escolha outro.' });
                return;
            }

            // salva no banco de dados (o payload ja contém thumb como string e galeria como array de strings)
            const novoRegistro = await Registro.create(payloadRegistro);

            if (dadosValidados.thumb) {
                preCacheImagem(dadosValidados.thumb);
            }
            if (dadosValidados.galeria && dadosValidados.galeria.length > 0) {
                dadosValidados.galeria.forEach(id => preCacheImagem(id));
            }

            res.status(201).json({
                message: 'Postagem criada com sucesso!',
                registro: novoRegistro
            });

        } catch (error: any) {
            console.error("ERRO AO CRIAR POSTAGEM:", error);
            if (error instanceof ZodError) {
                res.status(422).json({
                    message: "Dados inválidos",
                    errors: error.issues.map((issue) => issue.message)
                });
                return;
            }
            res.status(500).json({ message: 'Erro interno ao salvar a postagem.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const registro = await Registro.findByPk(Number(id));

            if (!registro) {
                res.status(404).json({ message: 'Postagem não encontrada.' });
                return;
            }

            const dadosValidados = postagemSchema.parse(req.body);
            const { payloadRegistro } = montarPayloadRegistro(dadosValidados);

            const slugExiste = await Registro.findOne({ where: { slug: dadosValidados.slug } });
            if (slugExiste && slugExiste.id !== registro.id) {
                res.status(422).json({ message: 'Este link (slug) já está em uso. Escolha outro.' });
                return;
            }

            await registro.update(payloadRegistro);

            if (dadosValidados.thumb) {
                preCacheImagem(dadosValidados.thumb);
            }
            if (dadosValidados.galeria && dadosValidados.galeria.length > 0) {
                dadosValidados.galeria.forEach(idImagem => preCacheImagem(idImagem));
            }

            res.status(200).json({
                message: 'Postagem atualizada com sucesso!',
                registro
            });
        } catch (error: any) {
            console.error("ERRO AO ATUALIZAR POSTAGEM:", error);
            if (error instanceof ZodError) {
                res.status(422).json({
                    message: "Dados inválidos",
                    errors: error.issues.map((issue) => issue.message)
                });
                return;
            }
            res.status(500).json({ message: 'Erro interno ao atualizar a postagem.' });
        }
    }

    // proxy para exibir imagem do google drive
    static async buscarImagem(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            // Otimização Máxima: Define WebP e Cache agressivo
            res.setHeader('Content-Type', 'image/webp');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            
            await getImagemStream(id as string, res);
        } catch (error) {
            console.error("ERRO NO PROXY DE IMAGEM:", error);
            if (!res.headersSent) {
                res.status(404).json({ message: 'Imagem não encontrada no Google Drive.' });
            }
        }
    }

    //busca imagem original do Google Drive
    static async buscarImagemOriginal(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: 'ID da imagem não fornecido.' });
                return;
            }
            await getImagemOriginalStream(id as string, res);
        } catch (error) {
            console.error("ERRO NO PROXY DE IMAGEM ORIGINAL:", error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Erro ao carregar imagem original.' });
            }
        }
    }


    // buscar postagem pública por slug
    static async buscarPorSlug(req: Request, res: Response): Promise<void> {
        try {
            const { slug } = req.params;

            const registro = await Registro.findOne({ where: { slug } });

            if (!registro) {
                res.status(404).json({ message: 'Postagem não encontrada.' });
                return;
            }

            res.status(200).json(registro);
        } catch (error) {
            console.error("ERRO AO BUSCAR POSTAGEM POR SLUG:", error);
            res.status(500).json({ message: 'Erro interno ao buscar a postagem.' });
        }
    }

    // buscar postagens por categoria com paginação
    static async buscarPorCategoriaPaginado(req: Request, res: Response): Promise<void> {
        try {
            const { categoria } = req.params;
            const limit = parseInt(req.query.limit as string) || 50;
            const pagina = parseInt(req.query.pagina as string) || 1;
            const offset = (pagina - 1) * limit;

            //garante que é uma string
            const categoriaStr = Array.isArray(categoria) ? categoria[0] : categoria;

            //formata a categoria vinda da URL
            const categoriaFormatada = formatarCategoriaDaUrl(categoriaStr);

            //valida se é uma categoria permitida
            if (!categoriaEhValida(categoriaFormatada)) {
                res.status(400).json({ message: 'Categoria inválida.' });
                return;
            }

            const registros = await Registro.findAll({
                order: [['createdAt', 'DESC']] //ordenar pelos mais recentes
            });

            const registrosFiltrados = registros.filter((registro) =>
                registroPossuiCategoria(registro, categoriaFormatada)
            );

            const registrosPaginados = registrosFiltrados.slice(offset, offset + limit);

            res.status(200).json({
                registros: registrosPaginados,
                total: registrosFiltrados.length,
                paginaAtual: pagina,
                totalPaginas: Math.ceil(registrosFiltrados.length / limit) || 1
            });
        } catch (error) {
            console.error("ERRO AO BUSCAR POSTAGENS POR CATEGORIA:", error);
            res.status(500).json({ message: 'Erro interno ao buscar as postagens da categoria.' });
        }
    }

    static async excluir(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const registro = await Registro.findByPk(Number(id));

            if (!registro) {
                res.status(404).json({ message: 'Postagem não encontrada.' });
                return;
            }

            await registro.destroy();

            res.status(200).json({ message: 'Postagem excluída com sucesso.' });
        } catch (error) {
            console.error("ERRO AO EXCLUIR POSTAGEM:", error);
            res.status(500).json({ message: 'Erro interno ao excluir a postagem.' });
        }
    }
}
