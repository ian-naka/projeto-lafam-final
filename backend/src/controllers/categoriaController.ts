import { Request, Response } from 'express';
import { categoriasDisponiveis, formatarSlugCategoria } from '../helpers/categorias';

export default class categoriaController {
  static async listar(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      categorias: categoriasDisponiveis.map((categoria) => ({
        nome: categoria,
        slug: formatarSlugCategoria(categoria),
      })),
    });
  }
}
