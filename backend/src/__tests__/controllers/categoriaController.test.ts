import { describe, expect, test } from 'bun:test';
import categoriaController from '../../controllers/categoriaController';

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

describe('controllers/categoriaController', () => {
  test('lista categorias publicas com nome e slug', async () => {
    const res = criarRespostaMock();

    await categoriaController.listar({} as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      categorias: [
        { nome: 'Flora', slug: 'flora' },
        { nome: 'Funga', slug: 'funga' },
        { nome: 'Biomas', slug: 'biomas' },
        { nome: 'Arqueologia', slug: 'arqueologia' },
        { nome: 'Fauna', slug: 'fauna' },
      ],
    });
  });
});
