import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import CartaoPostagem from '../componentes/CartaoPostagem';
import { useNotificacao } from '../contextos/NotificacaoContexto';
import { listarPostagens } from '../servicos/postagens';
import type { PostagemResumo } from '@lafam/back-front';

const ListaPostagensCategoria = () => {
  const { slugCategoria } = useParams({ strict: false }) as { slugCategoria?: string };
  const navigate = useNavigate();
  const [postagens, setPostagens] = useState<PostagemResumo[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const { mostrarNotificacao } = useNotificacao();
  const { t } = useTranslation();

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
        const resposta = await listarPostagens({ categoria: slugCategoria, pagina: paginaAtual, limit: 8 });
        setPostagens(resposta.registros);
        setTotalPaginas(resposta.totalPaginas);
      } catch (error) {
        mostrarNotificacao(error instanceof Error ? error.message : t('post.loadError'), 'erro');
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [slugCategoria, paginaAtual, mostrarNotificacao, t]);

  return (
    <section className="galeria-pagina">
      <div className="px-4 md:px-6 pt-[15vh] pb-6 md:pb-8">
        <div className="w-full max-w-[1180px] mx-auto">
          <div className="rounded-[24px] border border-gray-200 bg-white px-5 py-4 shadow-sm md:px-6 mb-4">
            <h1 className="lafam-text-display">
              {t('gallery.categoryTitle', { slug: slugCategoria })}
            </h1>
          </div>

          {carregando ? (
            <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="lafam-text-subtitle">{t('gallery.loadingPosts')}</p>
            </div>
          ) : postagens.length === 0 ? (
            <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="lafam-text-subtitle">{t('gallery.emptyCategory')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {postagens.map((postagem) => (
                  <CartaoPostagem key={postagem.id} postagem={postagem} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="paginacao mt-6 justify-center items-center gap-4">
                  <button
                    type="button"
                    onClick={() => atualizarPagina(Math.max(1, paginaAtual - 1))}
                    disabled={paginaAtual <= 1}
                  >
                    {t('gallery.previousPage')}
                  </button>
                  <span className="lafam-text-helper">
                    {t('gallery.pageStatus', { current: paginaAtual, total: totalPaginas })}
                  </span>
                  <button
                    type="button"
                    onClick={() => atualizarPagina(Math.min(totalPaginas, paginaAtual + 1))}
                    disabled={paginaAtual >= totalPaginas}
                  >
                    {t('gallery.nextPage')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListaPostagensCategoria;
