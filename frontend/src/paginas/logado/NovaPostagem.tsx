import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import FormularioPostagem, {
  type CampoTextoFormularioPostagem,
  type DadosFormularioPostagem,
} from '../../componentes/FormularioPostagem';
import { obterToken } from '../../ajudantes/autenticacao';
import { formularioPostagemInicial, montarPayloadPostagem, slugificar } from '../../ajudantes/postagem';
import { useNotificacao } from '../../contextos/NotificacaoContexto';
import { listarCategorias } from '../../servicos/categorias';
import { criarPostagem } from '../../servicos/postagens';
import type { Categoria, CategoriaDisponivel } from '@lafam/back-front';

const NovaPostagem = () => {
  const navigate = useNavigate();
  const { mostrarNotificacao } = useNotificacao();
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [formulario, setFormulario] = useState<DadosFormularioPostagem>(formularioPostagemInicial);

  useEffect(() => {
    listarCategorias().then(setCategoriasDisponiveis);
  }, []);

  const atualizarCampo = (chave: CampoTextoFormularioPostagem, valor: string) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [chave]: valor,
    }));
  };

  const selecionarCategoria = (categoria: CategoriaDisponivel) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      categoria,
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

  const enviar = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setCarregando(true);
      const token = obterToken();
      if (!token) throw new Error('Sessão expirada.');
      const payload = montarPayloadPostagem(formulario);

      await criarPostagem(payload, token);
      mostrarNotificacao('Postagem criada com sucesso.', 'sucesso');
      await navigate({ to: '/post/$slug', params: { slug: payload.slug } });
    } catch (error) {
      mostrarNotificacao(error instanceof Error ? error.message : 'Erro ao criar postagem.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <FormularioPostagem
      formulario={formulario}
      categoriasDisponiveis={categoriasDisponiveis}
      carregando={carregando}
      tituloPagina="Nova postagem"
      descricaoPagina="Preencha os dados principais e publique."
      textoBotao="Publicar postagem"
      aoAtualizarCampo={(chave, valor) => {
        if (chave === 'titulo') {
          setFormulario((estadoAtual) => ({
            ...estadoAtual,
            titulo: valor,
            slug: estadoAtual.slug ? estadoAtual.slug : slugificar(valor),
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

export default NovaPostagem;
