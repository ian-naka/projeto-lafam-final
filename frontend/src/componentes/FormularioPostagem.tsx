import BlocoCampo from './BlocoCampo';
import ListaCategoriasCheckbox from './ListaCategoriasCheckbox';
import MapaVisual from './MapaVisual';
import SeletorImagensDrive from './SeletorImagensDrive';
import type { Categoria } from '../tipos/categoria';

export interface DadosFormularioPostagem {
  titulo: string;
  slug: string;
  resumo: string;
  descricao: string;
  categoria: string;
  localidade: string;
  tags: string;
  latitude: string;
  longitude: string;
  citacao: string;
  thumb: string;
  galeria: string[];
}

interface FormularioPostagemProps {
  formulario: DadosFormularioPostagem;
  categoriasDisponiveis: Categoria[];
  carregando: boolean;
  tituloPagina: string;
  descricaoPagina: string;
  textoBotao: string;
  aoAtualizarCampo: (chave: keyof DadosFormularioPostagem, valor: string) => void;
  aoDefinirThumb: (id: string) => void;
  aoDefinirGaleria: (ids: string[]) => void;
  aoRemoverImagem: (id: string) => void;
  aoSelecionarCategoria: (categoria: string) => void;
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
          <BlocoCampo rotulo="Título">
            <input
              value={formulario.titulo}
              onChange={(e) => aoAtualizarCampo('titulo', e.target.value)}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Slug">
            <input
              value={formulario.slug}
              onChange={(e) => aoAtualizarCampo('slug', e.target.value)}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Resumo">
            <textarea
              value={formulario.resumo}
              onChange={(e) => aoAtualizarCampo('resumo', e.target.value)}
              rows={4}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Descrição">
            <textarea
              value={formulario.descricao}
              onChange={(e) => aoAtualizarCampo('descricao', e.target.value)}
              rows={10}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Citação">
            <textarea
              value={formulario.citacao}
              onChange={(e) => aoAtualizarCampo('citacao', e.target.value)}
              rows={3}
            />
          </BlocoCampo>
        </div>

        <div className="painel">
          <BlocoCampo rotulo="Categoria">
            <ListaCategoriasCheckbox
              categoriasDisponiveis={categoriasDisponiveis}
              categoriaSelecionada={formulario.categoria}
              aoSelecionar={aoSelecionarCategoria}
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Tags">
            <input
              value={formulario.tags}
              onChange={(e) => aoAtualizarCampo('tags', e.target.value)}
              placeholder="fungos, mata-atlantica"
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Localidade">
            <input
              value={formulario.localidade}
              onChange={(e) => aoAtualizarCampo('localidade', e.target.value)}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Latitude">
            <input
              value={formulario.latitude}
              onChange={(e) => aoAtualizarCampo('latitude', e.target.value)}
              placeholder="-21.7664"
            />
          </BlocoCampo>

          <BlocoCampo rotulo="Longitude">
            <input
              value={formulario.longitude}
              onChange={(e) => aoAtualizarCampo('longitude', e.target.value)}
              placeholder="-43.3444"
            />
          </BlocoCampo>

          <MapaVisual latitude={formulario.latitude} longitude={formulario.longitude} />
        </div>

        <div className="painel">
          <h2>Imagens</h2>
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
            {carregando ? 'Salvando...' : textoBotao}
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormularioPostagem;
