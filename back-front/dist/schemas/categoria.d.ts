export declare const categoriasDisponiveis: readonly ["Flora", "Funga", "Biomas", "Arqueologia", "Fauna"];
export type CategoriaDisponivel = (typeof categoriasDisponiveis)[number];
export type Categoria = {
    nome: CategoriaDisponivel;
    slug: string;
};
export declare function formatarSlugCategoria(categoria: string): string;
export declare function formatarCategoriaDaUrl(categoria: string): string;
export declare function categoriaEhValida(categoria: string): categoria is CategoriaDisponivel;
export declare const categoriasPadrao: Categoria[];
export type RespostaListaCategorias = {
    categorias: Categoria[];
};
