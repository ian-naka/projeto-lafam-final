import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import MapaVisual from '../componentes/MapaVisual';
import { extrairLatitudeLongitude } from '../ajudantes/coordenadas';
import { useNotificacao } from '../contextos/NotificacaoContexto';
import { buscarPostagemPorSlug } from '../servicos/postagens';
import { montarUrlApi } from '../servicos/api';
import type { PostagemDetalhe as PostagemDetalheTipo } from '@lafam/back-front';

const Skeleton = () => (
  <div className="min-h-screen bg-flora-surface flex items-center justify-center">
    <p className="text-flora-muted text-sm">Carregando...</p>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-flora-surface flex items-center justify-center">
    <p className="text-flora-muted text-sm">Postagem não encontrada.</p>
  </div>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const DetalhePostagem = () => {
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const [postagem, setPostagem] = useState<PostagemDetalheTipo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const { mostrarNotificacao } = useNotificacao();
  const { t } = useTranslation();

  useEffect(() => {
    if (!slug) return;

    const carregar = async () => {
      try {
        setCarregando(true);
        const dados = await buscarPostagemPorSlug(slug);
        setPostagem(dados);
      } catch (error) {
        mostrarNotificacao(error instanceof Error ? error.message : t('post.loadError'), 'erro');
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [slug, mostrarNotificacao, t]);

  if (carregando) return <Skeleton />;
  if (!postagem) return <NotFound />;

  const { latitude, longitude } = extrairLatitudeLongitude(postagem.coordenadas);
  const fotoPrincipal = postagem.galeria?.[0] ?? postagem.thumb;

  return (
    <div className="min-h-screen bg-flora-surface">
      <button className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 rounded-lg text-flora-ink hover:bg-flora-bg transition-colors z-10">
        <MenuIcon className="w-[22px] h-[22px]" />
      </button>

      {/* Title */}
      <div className="pt-24 pb-8 px-16 text-center max-[740px]:pt-16 max-[740px]:pb-4 max-[740px]:px-4">
        <h1 className="font-serif text-[44px] font-bold text-flora-ink leading-tight max-[740px]:text-[28px]">
          {postagem.titulo}
        </h1>
      </div>

      {/* Content Row: Photo + Map | Description */}
      <div className="flex gap-12 px-16 pb-16 max-[960px]:flex-col max-[960px]:gap-8 max-[740px]:px-4 max-[740px]:pb-8">
        {/* Left: Photo & Map Card */}
        <div className="w-[460px] flex-shrink-0 max-[960px]:w-full">
          <div className="rounded-2xl border border-flora-border bg-flora-surface p-5 flex flex-col gap-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            {fotoPrincipal && (
              <div className="w-full h-[260px] rounded-xl overflow-hidden bg-flora-bg max-[740px]:h-[200px]">
                <img
                  src={montarUrlApi(`/postagens/imagens/${fotoPrincipal}`)}
                  alt={postagem.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {postagem.coordenadas && (
              <>
                <div className="h-px bg-flora-border" />
                <h2 className="text-[18px] font-semibold text-flora-ink text-center">
                  Local aproximado
                </h2>
                <div className="w-full h-[210px] rounded-xl overflow-hidden bg-flora-bg border border-flora-border max-[740px]:h-[160px]">
                  <MapaVisual latitude={latitude} longitude={longitude} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Description */}
        <div className="flex-1 min-w-0">
          {postagem.descricao && (
            <div className="text-[15px] text-flora-ink leading-relaxed whitespace-pre-wrap">
              {postagem.descricao}
            </div>
          )}

          {postagem.citacao && (
            <div className="flex items-center gap-4 pt-8">
              <span className="text-[15px] font-medium text-flora-ink whitespace-nowrap">Citação:</span>
              <div className="inline-flex items-center rounded-lg bg-flora-surface border border-flora-border h-9 px-4">
                <span className="text-[13px] text-flora-ink font-mono">{postagem.citacao}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhePostagem;
