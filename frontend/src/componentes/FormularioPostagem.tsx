import { useTranslation } from 'react-i18next';
import BlocoCampo from './BlocoCampo';
import ListaCategoriasCheckbox from './ListaCategoriasCheckbox';
import MapaVisual from './MapaVisual';
import SeletorImagensDrive from './SeletorImagensDrive';
import type { Categoria, CategoriaDisponivel } from '@lafam/back-front';

export interface DadosFormularioPostagem {
  titulo: string;
  slug: string;
  resumo: string;
  descricao: string;
  categoria: CategoriaDisponivel;
  localidade: string;
  tags: string;
  latitude: string;
  longitude: string;
  citacao: string;
  thumb: string;
  galeria: string[];
}

export type CampoTextoFormularioPostagem = Exclude<keyof DadosFormularioPostagem, 'categoria' | 'galeria'>;

interface FormularioPostagemProps {
  formulario: DadosFormularioPostagem;
  categoriasDisponiveis: Categoria[];
  carregando: boolean;
  tituloPagina: string;
  descricaoPagina: string;
  textoBotao: string;
  aoAtualizarCampo: (chave: CampoTextoFormularioPostagem, valor: string) => void;
  aoDefinirThumb: (id: string) => void;
  aoDefinirGaleria: (ids: string[]) => void;
  aoRemoverImagem: (id: string) => void;
  aoSelecionarCategoria: (categoria: CategoriaDisponivel) => void;
  aoEnviar: (event: React.FormEvent) => void;
}

const FormularioPostagem = ({
  formulario,
  categoriasDisponiveis,
  carregando,
  tituloPagina,
  descricaoPagina,
  textoBotao,
  aoAtualizarCampo,
  aoDefinirThumb,
  aoDefinirGaleria,
  aoRemoverImagem,
  aoSelecionarCategoria,
  aoEnviar,
}: FormularioPostagemProps) => {
  const { t } = useTranslation();

  return (
    <section className="pagina">
      <div className="pagina__topo pagina__topo--entre">
        <div>
          <h1>{tituloPagina}</h1>
          <p>{descricaoPagina}</p>
        </div>
      </div>

      <form onSubmit={aoEnviar} className="formulario formulario--postagem">
        <div className="painel">
          <BlocoCampo rotulo={t('postForm.title')}>
            <input
              value={formulario.titulo}
              onChange={(e) => aoAtualizarCampo('titulo', e.target.value)}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.slug')}>
            <input
              value={formulario.slug}
              onChange={(e) => aoAtualizarCampo('slug', e.target.value)}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.summary')}>
            <textarea
              value={formulario.resumo}
              onChange={(e) => aoAtualizarCampo('resumo', e.target.value)}
              rows={4}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.description')}>
            <textarea
              value={formulario.descricao}
              onChange={(e) => aoAtualizarCampo('descricao', e.target.value)}
              rows={10}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.quote')}>
            <textarea
              value={formulario.citacao}
              onChange={(e) => aoAtualizarCampo('citacao', e.target.value)}
              rows={3}
            />
          </BlocoCampo>
        </div>

        <div className="painel">
          <BlocoCampo rotulo={t('postForm.category')}>
            <ListaCategoriasCheckbox
              categoriasDisponiveis={categoriasDisponiveis}
              categoriaSelecionada={formulario.categoria}
              aoSelecionar={aoSelecionarCategoria}
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.tags')}>
            <input
              value={formulario.tags}
              onChange={(e) => aoAtualizarCampo('tags', e.target.value)}
              placeholder={t('postForm.tagsPlaceholder')}
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.location')}>
            <input
              value={formulario.localidade}
              onChange={(e) => aoAtualizarCampo('localidade', e.target.value)}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.latitude')}>
            <input
              value={formulario.latitude}
              onChange={(e) => aoAtualizarCampo('latitude', e.target.value)}
              placeholder="-21.7664"
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.longitude')}>
            <input
              value={formulario.longitude}
              onChange={(e) => aoAtualizarCampo('longitude', e.target.value)}
              placeholder="-43.3444"
            />
          </BlocoCampo>

          <MapaVisual latitude={formulario.latitude} longitude={formulario.longitude} />
        </div>

        <div className="painel">
          <h2>{t('postForm.images')}</h2>
          <SeletorImagensDrive
            thumb={formulario.thumb}
            galeria={formulario.galeria}
            definirThumb={aoDefinirThumb}
            definirGaleria={aoDefinirGaleria}
            removerImagem={aoRemoverImagem}
          />
        </div>

        <div className="painel painel--acoes">
          <button type="submit" className="botao botao--primario" disabled={carregando}>
            {carregando ? t('postForm.saving') : textoBotao}
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormularioPostagem;
