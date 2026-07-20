import { useEffect, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import MapaVisual from '../componentes/MapaVisual';
import { extrairLatitudeLongitude } from '../ajudantes/coordenadas';
import { useNotificacao } from '../contextos/NotificacaoContexto';
import { buscarPostagemPorSlug } from '../servicos/postagens';
import { montarUrlApi } from '../servicos/api';
import type { PostagemDetalhe as PostagemDetalheTipo } from '@lafam/back-front';

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
  }, [slug, mostrarNotificacao]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-flora-bg flex items-center justify-center">
        <p className="text-flora-muted text-sm">{t('post.loading')}</p>
      </div>
    );
  }

  if (!postagem) {
    return (
      <div className="min-h-screen bg-flora-bg flex items-center justify-center">
        <p className="text-flora-muted text-sm">{t('post.notFound')}</p>
      </div>
    );
  }

  const { latitude, longitude } = extrairLatitudeLongitude(postagem.coordenadas);

  return (
    <div className="min-h-screen bg-flora-bg">
      <div className="mx-auto w-full max-w-[800px]">

        {/* Header */}
        <div className="flex items-center gap-3 h-[58px] px-5 py-3 bg-flora-surface">
          <div className="relative w-[34px] h-[34px] rounded-[17px] bg-flora-green-soft border border-[#C9D8C6] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 16 16" className="w-[19px] h-[19px] text-flora-green -rotate-[22deg]">
              <path fill="currentColor" d="M8 1C6 5 3 7 1 9c2 1 4 3 4 5 0 1-1 2-2 2h2c3 0 5-3 6-6 1 3 3 6 6 6h2c-1 0-2-1-2-2 0-2 2-4 4-5-2-2-5-4-7-8Z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-flora-green">LAFAM Flora</span>

          <div className="flex-1" />

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-flora-green">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </div>

        {/* Introdução */}
        <div className="flex items-center gap-4 pt-[22px] pb-[14px] px-[34px]">
          <div className="flex flex-col gap-[7px] flex-1">
            <Link to="/galeria" className="text-[10px] font-bold text-flora-gold uppercase tracking-[0.2em] hover:text-flora-green transition-colors">
              REGISTRO BOTÂNICO
            </Link>
            <h1 className="font-serif text-[36px] font-bold text-flora-ink leading-tight">
              {postagem.titulo}
            </h1>
            <p className="text-[11px] text-flora-muted leading-[1.35] max-w-[500px]">
              {postagem.resumo}
            </p>
          </div>

          {postagem.categoria && (
            <div className="flex flex-col gap-2 w-[136px] flex-shrink-0">
              <span className="inline-flex items-center rounded-[14px] bg-[#EFE8F8] h-[28px] px-[10px] text-[11px] font-bold text-flora-purple">
                {postagem.categoria}
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="flex gap-[18px] px-[34px] pb-[18px] max-[740px]:flex-col">

          {/* Card Mídia */}
          <div className="flex flex-col gap-[10px] p-3 rounded-[22px] border border-flora-border bg-flora-surface w-[286px] flex-shrink-0 max-[740px]:w-full">
            <div className="w-full h-[158px] rounded-2xl overflow-hidden bg-flora-muted/15">
              <img
                src={montarUrlApi(`/postagens/imagens/${postagem.thumb}`)}
                alt={postagem.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] text-flora-muted">
              {t('post.visualRecord')}
            </span>

            {postagem.coordenadas && (
              <div className="flex flex-col gap-2 p-[10px] rounded-2xl bg-[#F3F5F0]">
                <span className="text-[11px] font-bold text-flora-ink">
                  {t('post.approxLocation')}
                </span>
                <div className="w-full h-[94px] rounded-xl overflow-hidden bg-[#EEF1EA]">
                  <MapaVisual latitude={latitude} longitude={longitude} />
                </div>
              </div>
            )}
          </div>

          {/* Card Informações */}
          <div className="flex flex-col gap-[10px] p-4 rounded-[22px] border border-flora-border bg-flora-surface flex-1 min-w-0">
            <h2 className="font-serif text-[21px] font-bold text-flora-ink">
              {t('post.taxonomicData')}
            </h2>

            <div className="flex gap-2">
              <span className="text-[11px] font-bold text-flora-ink flex-shrink-0">{t('post.location')}:</span>
              <span className="text-[11px] text-flora-muted max-w-[270px]">{postagem.localidade}</span>
            </div>

            {postagem.categoria && (
              <div className="flex gap-2">
                <span className="text-[11px] font-bold text-flora-ink flex-shrink-0">{t('post.category')}:</span>
                <span className="text-[11px] text-flora-muted max-w-[270px]">{postagem.categoria}</span>
              </div>
            )}

            {postagem.tags && (
              <div className="flex gap-2">
                <span className="text-[11px] font-bold text-flora-ink flex-shrink-0">{t('post.tags')}:</span>
                <span className="text-[11px] text-flora-muted max-w-[270px]">{postagem.tags}</span>
              </div>
            )}

            {postagem.citacao && (
              <div className="flex flex-col gap-[6px] p-[10px] rounded-[14px] bg-flora-bg">
                <span className="text-[10px] font-bold text-flora-green">
                  {t('post.citation')}
                </span>
                <span className="text-[10px] text-flora-muted leading-[1.35]">
                  {postagem.citacao}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        {postagem.descricao && (
          <div className="px-[34px] pb-[18px] text-[14px] text-flora-ink leading-relaxed whitespace-pre-wrap">
            {postagem.descricao}
          </div>
        )}

        {/* Galeria */}
        {postagem.galeria && postagem.galeria.length > 0 && (
          <div className="px-[34px] pb-[18px]">
            <h2 className="font-serif text-[21px] font-bold text-flora-ink mb-[10px]">
              {t('post.gallery')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {postagem.galeria.map((imagem, index) => (
                <img
                  key={`${imagem}-${index}`}
                  src={montarUrlApi(`/postagens/imagens/${imagem}`)}
                  alt={t('post.imageAlt', { title: postagem.titulo, index: index + 1 })}
                  className="w-full h-[158px] object-cover rounded-2xl"
                />
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-[10px] px-[34px] pb-5">
          <div className="flex-1" />
          <Link
            to="/galeria"
            className="inline-flex items-center rounded-xl border border-flora-border bg-flora-surface h-[38px] px-[15px] text-[13px] font-bold text-flora-green hover:bg-flora-bg transition-colors"
          >
            &larr; {t('post.backToGallery')}
          </Link>
          <a
            href="/galeria"
            className="inline-flex items-center rounded-xl border border-flora-green bg-flora-green h-[38px] px-[15px] text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
          >
            {t('post.edit')}
          </a>
        </div>

      </div>
    </div>
  );
};

export default DetalhePostagem;
