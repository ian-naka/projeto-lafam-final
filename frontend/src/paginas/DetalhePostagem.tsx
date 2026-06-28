import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
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
    return <section className="pagina"><div className="painel">{t('post.loading')}</div></section>;
  }

  if (!postagem) {
    return <section className="pagina"><div className="painel">{t('post.notFound')}</div></section>;
  }

  const { latitude, longitude } = extrairLatitudeLongitude(postagem.coordenadas);

  return (
    <section className="pagina">
      <article className="painel painel--postagem">
        <h1>{postagem.titulo}</h1>
        <p className="postagem__resumo">{postagem.resumo}</p>

        <div className="postagem__meta">
          <p><strong>{t('post.location')}</strong> {postagem.localidade}</p>
          <p><strong>{t('post.category')}</strong> {postagem.categoria}</p>
          {postagem.tags && <p><strong>{t('post.tags')}</strong> {postagem.tags}</p>}
        </div>

        <img
          src={montarUrlApi(`/postagens/imagens/${postagem.thumb}`)}
          alt={postagem.titulo}
          className="postagem__capa"
        />

        <div className="postagem__descricao">{postagem.descricao}</div>

        {postagem.citacao && (
          <blockquote className="postagem__citacao">
            {postagem.citacao}
          </blockquote>
        )}

        {postagem.coordenadas && (
          <div>
            <h2>{t('post.map')}</h2>
            <MapaVisual latitude={latitude} longitude={longitude} />
          </div>
        )}

        {postagem.galeria && postagem.galeria.length > 0 && (
          <div>
            <h2>{t('post.gallery')}</h2>
            <div className="grade-galeria">
              {postagem.galeria.map((imagem, index) => (
                <img
                  key={`${imagem}-${index}`}
                  src={montarUrlApi(`/postagens/imagens/${imagem}`)}
                  alt={t('post.imageAlt', { title: postagem.titulo, index: index + 1 })}
                  className="galeria__imagem"
                />
              ))}
            </div>
          </div>
        )}
      </article>
    </section>
  );
};

export default DetalhePostagem;
