import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';

const mocksAdmin = {
  findOne: mock(),
  create: mock(),
  findByPk: mock(),
};

const mocksCrypto = {
  encriptar: mock((valor: string) => `enc:${valor}`),
  desencriptar: mock((valor: string) => valor.replace(/^enc:/, '')),
};

mock.module('../../models/Admin', () => ({
  default: mocksAdmin,
}));

mock.module('../../helpers/criptoHelper', () => ({
  encriptar: mocksCrypto.encriptar,
  desencriptar: mocksCrypto.desencriptar,
}));

beforeAll(() => {
  process.env.JWT_SECRET = 'segredo-de-teste';
});

let authController: typeof import('../../controllers/authController').default;

function criarRespostaMock() {
  return {
    statusCode: 200,
    body: undefined as unknown,
    status(codigo: number) {
      this.statusCode = codigo;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

describe('controllers/authController', () => {
  beforeEach(async () => {
    if (!authController) {
      const modulo = await import('../../controllers/authController');
      authController = modulo.default;
    }

    Object.values(mocksAdmin).forEach((mockFn) => mockFn.mockReset());
    Object.values(mocksCrypto).forEach((mockFn) => mockFn.mockClear());
  });

  test('retorna 422 quando o login nao encontra admin', async () => {
    const req = {
      body: {
        email: 'admin@lafam.local',
        senha: '123456',
      },
    };
    const res = criarRespostaMock();

    mocksAdmin.findOne.mockResolvedValue(null);

    await authController.login(req as never, res as never);

    expect(res.statusCode).toBe(422);
    expect(res.body).toEqual({ message: 'E-mail ou senha incorretos!' });
  });
});
