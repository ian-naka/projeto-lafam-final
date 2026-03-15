// função utilitária para remover tags html básicas e espaços indesejados
export const sanitizarTextoSimples = (texto: string) => {
    if (!texto) return '';
    const semTags = texto.replace(/<[^>]*>?/gm, '');
    return semTags.trim();
};
