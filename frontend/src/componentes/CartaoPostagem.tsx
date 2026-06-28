import { Link } from '@tanstack/react-router';
import { montarUrlApi } from '../servicos/api';
import type { PostagemResumo } from '@lafam/back-front';

const CartaoPostagem = ({ postagem }: { postagem: PostagemResumo }) => {
  return (
    <article className="cartao-postagem">
      <Link
        to="/post/$slug"
        params={{ slug: postagem.slug }}
        className="cartao-postagem__imagem-link"
      >
        <img
          src={montarUrlApi(`/postagens/imagens/${postagem.thumb}`)}
          alt={postagem.titulo}
          className="cartao-postagem__imagem"
        />
      </Link>

      <div className="cartao-postagem__corpo">
        <h3>{postagem.titulo}</h3>
        <p>{postagem.resumo}</p>
      </div>
    </article>
  );
};

export default CartaoPostagem;
