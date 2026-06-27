import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import CartaoPostagem from '../componentes/CartaoPostagem';
import { listarPostagens } from '../servicos/postagens';
import type { PostagemResumo } from '../tipos/postagem';

const ListaPostagensCategoria = () => {
  const { slugCategoria } = useParams({ strict: false }) as { slugCategoria?: string };
  const navigate = useNavigate();
  const [postagens, setPostagens] = useState<PostagemResumo[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(true);

  const paginaAtual = Number(new URLSearchParams(window.location.search).get('pagina') || '1');

  const atualizarPagina = async (pagina: number) => {
    if (!slugCategoria) return;
    await navigate({
      to: '/galeria/$slugCategoria',
      params: { slugCategoria },
      search: { pagina: String(pagina) } as never,
    });
  };

  useEffect(() => {
    if (!slugCategoria) return;

    const carregar = async () => {
      try {
        setCarregando(true);
        const dados = await listarPostagens({
          categoria: slugCategoria,
          pagina: paginaAtual,
          limit: 24,
        });
        setPostagens(dados.registros || []);
        setTotalPaginas(dados.totalPaginas || 1);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [slugCategoria, paginaAtual]);

  return (
    <section className="pagina">
      <div className="pagina__topo">
        <h1>Categoria: {slugCategoria}</h1>
      </div>

      {carregando ? (
        <div className="painel">Carregando postagens...</div>
      ) : postagens.length === 0 ? (
        <div className="painel">Nenhuma postagem encontrada para esta categoria.</div>
      ) : (
        <>
          <div className="grade-postagens">
            {postagens.map((postagem) => (
              <CartaoPostagem key={postagem.id} postagem={postagem} />
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacao">
              <button
                type="button"
                onClick={() => atualizarPagina(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual <= 1}
              >
                Anterior
              </button>
              <span>Página {paginaAtual} de {totalPaginas}</span>
              <button
                type="button"
                onClick={() => atualizarPagina(Math.min(totalPaginas, paginaAtual + 1))}
                disabled={paginaAtual >= totalPaginas}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ListaPostagensCategoria;
