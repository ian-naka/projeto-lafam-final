import { describe, expect, test } from 'bun:test';
import {
  categoriaEhValida,
  categoriasDisponiveis,
  formatarCategoriaDaUrl,
  formatarSlugCategoria,
} from '../../helpers/categorias';

describe('helpers/categorias', () => {
  test('lista categorias disponiveis esperadas', () => {
    expect(categoriasDisponiveis).toEqual([
      'Flora',
      'Funga',
      'Biomas',
      'Arqueologia',
      'Fauna',
    ]);
  });

  test('formata slug de categoria em minusculas', () => {
    expect(formatarSlugCategoria('Arqueologia')).toBe('arqueologia');
  });

  test('formata categoria vinda da url', () => {
    expect(formatarCategoriaDaUrl('fLoRa')).toBe('Flora');
  });

  test('valida apenas categorias permitidas', () => {
    expect(categoriaEhValida('Fauna')).toBe(true);
    expect(categoriaEhValida('Minerais')).toBe(false);
  });
});
