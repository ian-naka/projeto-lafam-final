import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import FormularioPostagem, { type DadosFormularioPostagem } from '../../componentes/FormularioPostagem';
import { obterToken } from '../../ajudantes/autenticacao';
import {
  formularioPostagemInicial,
  montarFormularioAPartirDaPostagem,
  montarPayloadPostagem,
  slugificar,
} from '../../ajudantes/postagem';
import { useNotificacao } from '../../contextos/NotificacaoContexto';
import { listarCategorias } from '../../servicos/categorias';
import { atualizarPostagem, buscarPostagemPorSlug } from '../../servicos/postagens';
import type { Categoria } from '../../tipos/categoria';
import type { PostagemDetalhe } from '../../tipos/postagem';

const EditarPostagem = () => {
  const navigate = useNavigate();
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const { mostrarNotificacao } = useNotificacao();
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);
  const [formulario, setFormulario] = useState<DadosFormularioPostagem>(formularioPostagemInicial);
  const [postagem, setPostagem] = useState<PostagemDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarCategorias().then(setCategoriasDisponiveis);
  }, []);

  useEffect(() => {
    if (!slug) {
      setCarregando(false);
      return;
    }

    const carregar = async () => {
      try {
        setCarregando(true);
        const dados = await buscarPostagemPorSlug(slug);
        setPostagem(dados);
        setFormulario(montarFormularioAPartirDaPostagem(dados));
      } catch (error) {
        mostrarNotificacao(error instanceof Error ? error.message : 'Erro ao carregar postagem.', 'erro');
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [slug, mostrarNotificacao]);

  const atualizarCampo = (chave: keyof DadosFormularioPostagem, valor: string) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [chave]: valor,
    }));
  };

  const definirThumb = (id: string) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      thumb: id,
      galeria: estadoAtual.galeria.includes(id) ? estadoAtual.galeria : [id, ...estadoAtual.galeria],
    }));
  };

  const definirGaleria = (ids: string[]) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      galeria: Array.from(new Set([...estadoAtual.galeria, ...ids])),
      thumb: estadoAtual.thumb || ids[0] || '',
    }));
  };

  const removerImagem = (id: string) => {
    setFormulario((estadoAtual) => {
      const galeria = estadoAtual.galeria.filter((imagem) => imagem !== id);

      return {
        ...estadoAtual,
        galeria,
        thumb: estadoAtual.thumb === id ? galeria[0] || '' : estadoAtual.thumb,
      };
    });
  };

  const selecionarCategoria = (categoria: string) => {
    atualizarCampo('categoria', categoria);
  };

  const enviar = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!postagem) {
        throw new Error('Postagem não encontrada para edição.');
      }

      setSalvando(true);
      const token = obterToken();
      if (!token) throw new Error('Sessão expirada.');

      const payload = montarPayloadPostagem(formulario);
      await atualizarPostagem(postagem.id, payload, token);
      mostrarNotificacao('Postagem atualizada com sucesso.', 'sucesso');
      await navigate({ to: '/post/$slug', params: { slug: payload.slug } });
    } catch (error) {
      mostrarNotificacao(error instanceof Error ? error.message : 'Erro ao atualizar postagem.', 'erro');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <section className="pagina"><div className="painel">Carregando postagem...</div></section>;
  }

  if (!postagem) {
    return <section className="pagina"><div className="painel">Postagem não encontrada.</div></section>;
  }

  return (
    <FormularioPostagem
      formulario={formulario}
      categoriasDisponiveis={categoriasDisponiveis}
      carregando={salvando}
      tituloPagina="Editar postagem"
      descricaoPagina="Atualize os dados e salve as alterações."
      textoBotao="Salvar alterações"
      aoAtualizarCampo={(chave, valor) => {
        if (chave === 'titulo') {
          setFormulario((estadoAtual) => ({
            ...estadoAtual,
            titulo: valor,
          }));
          return;
        }

        if (chave === 'slug') {
          atualizarCampo('slug', slugificar(valor));
          return;
        }

        atualizarCampo(chave, valor);
      }}
      aoDefinirThumb={definirThumb}
      aoDefinirGaleria={definirGaleria}
      aoRemoverImagem={removerImagem}
      aoSelecionarCategoria={selecionarCategoria}
      aoEnviar={enviar}
    />
  );
};

export default EditarPostagem;
