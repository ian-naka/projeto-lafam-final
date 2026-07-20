import { Op, type WhereOptions } from 'sequelize';
import Registro from '../models/Registro';
import { categoriaEhValida, formatarCategoriaDaUrl } from '../helpers/categorias';

type ParametrosListagemPostagens = {
  busca?: unknown;
  categoria?: unknown;
  pagina?: unknown;
  limit?: unknown;
};

type ParametrosNormalizadosListagem = {
  busca?: string;
  categoria?: Registro['categoria'];
  pagina: number;
  limit: number;
  offset: number;
};

const LIMITE_PADRAO = 40;
const LIMITE_MAXIMO = 100;

function normalizarNumeroInteiroPositivo(valor: unknown, valorPadrao: number): number {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero < 1) {
    return valorPadrao;
  }

  return numero;
}

export default class PostagemService {
  static normalizarParametrosListagem(
    params: ParametrosListagemPostagens
  ): ParametrosNormalizadosListagem {
    const pagina = normalizarNumeroInteiroPositivo(params.pagina, 1);
    const limitInformado = normalizarNumeroInteiroPositivo(params.limit, LIMITE_PADRAO);
    const limit = Math.min(limitInformado, LIMITE_MAXIMO);
    const busca =
      typeof params.busca === 'string' && params.busca.trim().length > 0
        ? params.busca.trim()
        : undefined;

    let categoria: Registro['categoria'] | undefined;
    if (typeof params.categoria === 'string' && params.categoria.trim().length > 0) {
      const categoriaFormatada = formatarCategoriaDaUrl(params.categoria.trim());

      if (!categoriaEhValida(categoriaFormatada)) {
        throw new Error('Categoria inválida.');
      }

      categoria = categoriaFormatada;
    }

    return {
      busca,
      categoria,
      pagina,
      limit,
      offset: (pagina - 1) * limit,
    };
  }

  static montarFiltroPostagens(
    params: Pick<ParametrosNormalizadosListagem, 'busca' | 'categoria'>
  ): WhereOptions {
    const whereBase: Record<string, unknown> = {};

    if (params.categoria) {
      whereBase.categoria = params.categoria;
    }

    if (params.busca) {
      return {
        ...whereBase,
        [Op.or]: [
          { titulo: { [Op.like]: `%${params.busca}%` } },
          { tags: { [Op.like]: `%${params.busca}%` } },
        ],
      } as WhereOptions;
    }

    return whereBase as WhereOptions;
  }

  static async listarPostagensPaginadas(params: ParametrosListagemPostagens) {
    const parametros = PostagemService.normalizarParametrosListagem(params);
    const where = PostagemService.montarFiltroPostagens(parametros);

    const { rows, count } = await Registro.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parametros.limit,
      offset: parametros.offset,
    });

    return {
      registros: rows,
      total: count,
      paginaAtual: parametros.pagina,
      totalPaginas: Math.ceil(count / parametros.limit) || 1,
    };
  }
}
