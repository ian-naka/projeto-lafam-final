import { beforeAll, describe, expect, test } from 'bun:test';

let encriptar: (texto: string) => string;
let desencriptar: (textoEncriptado: string) => string;

beforeAll(async () => {
  process.env.EMAIL_ENCRYPTION_KEY = '12345678901234567890123456789012';
  const modulo = await import('../../helpers/criptoHelper');
  encriptar = modulo.encriptar;
  desencriptar = modulo.desencriptar;
});

describe('helpers/criptoHelper', () => {
  test('encripta e desencripta o email corretamente', () => {
    const email = 'admin@lafam.local';
    const encriptado = encriptar(email);

    expect(encriptado).not.toBe(email);
    expect(desencriptar(encriptado)).toBe(email);
  });
});
