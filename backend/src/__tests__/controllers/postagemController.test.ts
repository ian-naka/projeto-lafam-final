import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { Op } from 'sequelize';

const mocksRegistro = {
  findAndCountAll: mock(),
  findOne: mock(),
  create: mock(),
  findByPk: mock(),
};

const mocksDrive = {
  getImagemStream: mock(),
  getImagemOriginalStream: mock(),
  preCacheImagem: mock(),
};

mock.module('../../models/Registro', () => ({
  default: mocksRegistro,
}));

mock.module('../../services/googleDriveService', () => ({
  getImagemStream: mocksDrive.getImagemStream,
  getImagemOriginalStream: mocksDrive.getImagemOriginalStream,
  preCacheImagem: mocksDrive.preCacheImagem,
}));

let postagemController: typeof import('../../controllers/postagemController').default;

function criarRespostaMock() {
  return {
    statusCode: 200,
    body: undefined as unknown,
    headersSent: false,
    headers: {} as Record<string, string>,
    status(codigo: number) {
      this.statusCode = codigo;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    send(payload: unknown) {
      this.body = payload;
      this.headersSent = true;
      return this;
    },
    setHeader(chave: string, valor: string) {
      this.headers[chave] = valor;
    },
  };
}

describe('controllers/postagemController', () => {
  beforeEach(async () => {
    if (!postagemController) {
      const modulo = await import('../../controllers/postagemController');
      postagemController = modulo.default;
    }

    Object.values(mocksRegistro).forEach((mockFn) => mockFn.mockReset());
    Object.values(mocksDrive).forEach((mockFn) => mockFn.mockReset());
  });

  test('lista postagens filtrando categoria invalida com 400', async () => {
    const req = {
      query: {
        categoria: 'minerais',
      },
    };
    const res = criarRespostaMock();

    await postagemController.listar(req as never, res as never);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Categoria inválida.' });
  });

  test('lista postagens com busca e paginacao direto no banco', async () => {
    const registros = [
      {
        id: 1,
        titulo: 'Orquidea rara',
        slug: 'orquidea-rara',
        resumo: 'Resumo',
        thumb: 'thumb-1',
        categoria: 'Flora',
      },
    ];
    const req = {
      query: {
        categoria: 'flora',
        busca: 'orquidea',
        pagina: '2',
        limit: '40',
      },
    };
    const res = criarRespostaMock();

    mocksRegistro.findAndCountAll.mockResolvedValue({
      rows: registros,
      count: 51,
    });

    await postagemController.listar(req as never, res as never);

    expect(mocksRegistro.findAndCountAll).toHaveBeenCalledWith({
      where: {
        categoria: 'Flora',
        [Op.or]: [
          { titulo: { [Op.like]: '%orquidea%' } },
          { tags: { [Op.like]: '%orquidea%' } },
        ],
      },
      order: [['createdAt', 'DESC']],
      limit: 40,
      offset: 40,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      registros,
      total: 51,
      paginaAtual: 2,
      totalPaginas: 2,
    });
  });

  test('busca postagens por categoria paginada reutilizando a mesma listagem', async () => {
    const req = {
      params: {
        categoria: 'funga',
      },
      query: {},
    };
    const res = criarRespostaMock();

    mocksRegistro.findAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await postagemController.buscarPorCategoriaPaginado(req as never, res as never);

    expect(mocksRegistro.findAndCountAll).toHaveBeenCalledWith({
      where: {
        categoria: 'Funga',
      },
      order: [['createdAt', 'DESC']],
      limit: 40,
      offset: 0,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      registros: [],
      total: 0,
      paginaAtual: 1,
      totalPaginas: 1,
    });
  });

  test('cria postagem com coordenadas derivadas e categoria unica', async () => {
    const req = {
      body: {
        titulo: 'Cogumelo raro',
        slug: 'cogumelo-raro',
        resumo: 'Resumo valido',
        descricao: 'Descricao longa o suficiente para passar na validacao.',
        categoria: 'Funga',
        localidade: 'Mata Atlantica',
        latitude: '-21.7664',
        longitude: '-43.3444',
        thumb: 'thumb-id',
        galeria: ['img-1', 'img-2'],
        tags: 'fungo',
      },
    };
    const res = criarRespostaMock();
    const registroCriado = {
      id: 10,
      ...req.body,
      coordenadas: '-21.7664, -43.3444',
    };

    mocksRegistro.findOne.mockResolvedValue(null);
    mocksRegistro.create.mockResolvedValue(registroCriado);

    await postagemController.criar(req as never, res as never);

    expect(mocksRegistro.create).toHaveBeenCalledWith(
      expect.objectContaining({
        categoria: 'Funga',
        coordenadas: '-21.7664, -43.3444',
      })
    );
    expect(mocksDrive.preCacheImagem).toHaveBeenCalledTimes(3);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      message: 'Postagem criada com sucesso!',
      registro: registroCriado,
    });
  });

  test('bloqueia criacao de slug duplicado com 422', async () => {
    const req = {
      body: {
        titulo: 'Registro repetido',
        slug: 'registro-repetido',
        resumo: 'Resumo valido',
        descricao: 'Descricao longa o suficiente para passar na validacao.',
        categoria: 'Flora',
        localidade: 'Serra',
        latitude: '-21.0000',
        longitude: '-43.0000',
        thumb: 'thumb-id',
        galeria: ['img-1'],
      },
    };
    const res = criarRespostaMock();

    mocksRegistro.findOne.mockResolvedValue({ id: 99, slug: 'registro-repetido' });

    await postagemController.criar(req as never, res as never);

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual({
      message: 'Este link (slug) já está em uso. Escolha outro.',
    });
    expect(mocksRegistro.create).not.toHaveBeenCalled();
  });
});
