"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriasPadrao = exports.categoriasDisponiveis = void 0;
exports.formatarSlugCategoria = formatarSlugCategoria;
exports.formatarCategoriaDaUrl = formatarCategoriaDaUrl;
exports.categoriaEhValida = categoriaEhValida;
exports.categoriasDisponiveis = [
    'Flora',
    'Funga',
    'Biomas',
    'Arqueologia',
    'Fauna',
];
function formatarSlugCategoria(categoria) {
    return categoria.toLowerCase();
}
function formatarCategoriaDaUrl(categoria) {
    return categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
}
function categoriaEhValida(categoria) {
    return exports.categoriasDisponiveis.includes(categoria);
}
exports.categoriasPadrao = exports.categoriasDisponiveis.map((categoria) => ({
    nome: categoria,
    slug: formatarSlugCategoria(categoria),
}));
