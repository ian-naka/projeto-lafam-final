import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { obterToken } from '../../ajudantes/autenticacao';
import { useNotificacao } from '../../contextos/NotificacaoContexto';
import { excluirPostagem, listarPostagens } from '../../servicos/postagens';
import { montarUrlApi } from '../../servicos/api';
import type { PostagemResumo } from '../../tipos/postagem';

const AdminPostagens = () => {
  const [postagens, setPostagens] = useState<PostagemResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { mostrarNotificacao } = useNotificacao();

  const carregar = async () => {
    try {
      setCarregando(true);
      const dados = await listarPostagens({ pagina: 1, limit: 200 });
      setPostagens(dados.registros || []);
    } catch (error) {
      mostrarNotificacao(error instanceof Error ? error.message : 'Erro ao listar postagens.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const remover = async (id: number) => {
    const confirmar = window.confirm('Deseja excluir esta postagem?');
    if (!confirmar) return;

    try {
      const token = obterToken();
      if (!token) throw new Error('Sessão expirada.');
      await excluirPostagem(id, token);
      setPostagens((estadoAtual) => estadoAtual.filter((postagem) => postagem.id !== id));
      mostrarNotificacao('Postagem excluída com sucesso.', 'sucesso');
    } catch (error) {
      mostrarNotificacao(error instanceof Error ? error.message : 'Erro ao excluir postagem.', 'erro');
    }
  };

  return (
    <section className="pagina">
      <div className="pagina__topo pagina__topo--entre">
        <div>
          <h1>Postagens</h1>
          <p>Gerencie o conteúdo publicado.</p>
        </div>
        <Link to="/admin/nova-postagem" className="botao botao--primario">
          Nova postagem
        </Link>
      </div>

      {carregando ? (
        <div className="painel">Carregando postagens...</div>
      ) : postagens.length === 0 ? (
        <div className="painel">Nenhuma postagem cadastrada.</div>
      ) : (
        <div className="lista-admin">
          {postagens.map((postagem) => (
            <article key={postagem.id} className="painel painel--admin">
              <img
                src={montarUrlApi(`/postagens/imagens/${postagem.thumb}`)}
                alt={postagem.titulo}
                className="admin__thumb"
              />
              <div className="admin__conteudo">
                <h2>{postagem.titulo}</h2>
                <p className="admin__slug">/{postagem.slug}</p>
                <p>{postagem.resumo}</p>
                <div className="admin__acoes">
                  <Link
                    to="/post/$slug"
                    params={{ slug: postagem.slug }}
                    className="botao botao--secundario"
                  >
                    Ver
                  </Link>
                  <Link
                    to="/admin/postagens/$slug/editar"
                    params={{ slug: postagem.slug }}
                    className="botao botao--secundario"
                  >
                    Editar
                  </Link>
                  <button type="button" className="botao botao--perigo" onClick={() => remover(postagem.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminPostagens;
