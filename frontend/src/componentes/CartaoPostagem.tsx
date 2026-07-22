import { Link } from '@tanstack/react-router';
import { montarUrlApi } from '../servicos/api';
import type { PostagemResumo } from '@lafam/back-front';

const CartaoPostagem = ({ postagem }: { postagem: PostagemResumo }) => {
  const srcImagem = postagem.thumb.startsWith('http')
    ? postagem.thumb
    : montarUrlApi(`/postagens/imagens/${postagem.thumb}`);

  return (
    <article className="cartao-postagem h-[300px]">
      <Link
        to="/post/$slug"
        params={{ slug: postagem.slug }}
        className="cartao-postagem__imagem-link"
      >
        <img
          src={srcImagem}
          alt={postagem.titulo}
          className="cartao-postagem__imagem h-[180px]"
        />
      </Link>

      <div className="cartao-postagem__corpo flex-1 min-h-0">
        <h3 className="line-clamp-1">{postagem.titulo}</h3>
        <p className="line-clamp-2">{postagem.resumo}</p>
      </div>
    </article>
  );
};

export default CartaoPostagem;
