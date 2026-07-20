import { useTranslation } from 'react-i18next';
import BlocoCampo from './BlocoCampo';
import { Button } from './botao/Button';
import { Container } from './container';
import { Input } from './input/Input';
import ListaCategoriasCheckbox from './ListaCategoriasCheckbox';
import MapaVisual from './MapaVisual';
import SeletorImagensDrive from './SeletorImagensDrive';
import { useResponsividade } from '../hooks';
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
  const { usaLayoutEmpilhado } = useResponsividade();
  const classeTextarea =
    'lafam-input min-h-[110px] w-full rounded-[8px] border border-[#E5E5E5] bg-[#FDF8F8] px-[12px] py-[10px] text-[14px] text-[#0A0A0A] shadow-sm placeholder:text-[#737373] transition-[border-color,box-shadow] duration-200 focus:border-[#D4D4D4] focus:outline-none focus:ring-0 focus-visible:border-[#D4D4D4] focus-visible:outline-none focus-visible:ring-0';
  const classeSecao = 'flex flex-col gap-5 rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm md:p-6';

  return (
    <Container
      ancoradoNoTopo
      contentClassName="h-auto min-h-[calc(100dvh-5rem)] w-full max-w-[1180px] items-stretch justify-start px-4 py-6 md:px-6 md:py-8"
    >
      <section className="flex w-full flex-col gap-4">

        <form
          onSubmit={aoEnviar}
          className="flex flex-col gap-4"
        >
          <div className="rounded-[24px] border border-gray-200 bg-white px-5 py-4 shadow-sm md:px-6">
            <div className={`flex gap-4 ${usaLayoutEmpilhado ? 'flex-col items-start' : 'items-center justify-between'}`}>
              <div className="flex flex-col gap-2 text-left">
                <h1 className="lafam-text-display">{tituloPagina}</h1>
                <p className="lafam-text-subtitle">{descricaoPagina}</p>
              </div>
              <Button type="submit" className="h-11 min-w-[220px]" disabled={carregando}>
                {carregando ? t('postForm.saving') : textoBotao}
              </Button>
            </div>
          </div>

          <div
            className={`grid gap-4 ${usaLayoutEmpilhado ? 'grid-cols-1' : 'grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]'}`}
          >
          <div className={classeSecao}>
          <BlocoCampo rotulo={t('postForm.title')}>
            <Input
              value={formulario.titulo}
              onChange={(e) => aoAtualizarCampo('titulo', e.target.value)}
              required
              className="h-11"
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.slug')}>
            <Input
              value={formulario.slug}
              onChange={(e) => aoAtualizarCampo('slug', e.target.value)}
              required
              className="h-11"
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.summary')}>
            <textarea
              className={classeTextarea}
              value={formulario.resumo}
              onChange={(e) => aoAtualizarCampo('resumo', e.target.value)}
              rows={4}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.description')}>
            <textarea
              className={`${classeTextarea} min-h-[220px]`}
              value={formulario.descricao}
              onChange={(e) => aoAtualizarCampo('descricao', e.target.value)}
              rows={10}
              required
            />
          </BlocoCampo>

          <BlocoCampo rotulo={t('postForm.quote')}>
            <textarea
              className={`${classeTextarea} min-h-[96px]`}
              value={formulario.citacao}
              onChange={(e) => aoAtualizarCampo('citacao', e.target.value)}
              rows={3}
            />
          </BlocoCampo>
          </div>

          <div className="flex flex-col gap-4">
            <div className={classeSecao}>
              <BlocoCampo rotulo={t('postForm.category')}>
                <ListaCategoriasCheckbox
                  categoriasDisponiveis={categoriasDisponiveis}
                  categoriaSelecionada={formulario.categoria}
                  aoSelecionar={aoSelecionarCategoria}
                />
              </BlocoCampo>

              <BlocoCampo rotulo={t('postForm.tags')}>
                <Input
                  value={formulario.tags}
                  onChange={(e) => aoAtualizarCampo('tags', e.target.value)}
                  placeholder={t('postForm.tagsPlaceholder')}
                  className="h-11"
                />
              </BlocoCampo>

              <BlocoCampo rotulo={t('postForm.location')}>
                <Input
                  value={formulario.localidade}
                  onChange={(e) => aoAtualizarCampo('localidade', e.target.value)}
                  required
                  className="h-11"
                />
              </BlocoCampo>

              <BlocoCampo rotulo={t('postForm.latitude')}>
                <Input
                  value={formulario.latitude}
                  onChange={(e) => aoAtualizarCampo('latitude', e.target.value)}
                  placeholder="-21.7664"
                  className="h-11"
                />
              </BlocoCampo>

              <BlocoCampo rotulo={t('postForm.longitude')}>
                <Input
                  value={formulario.longitude}
                  onChange={(e) => aoAtualizarCampo('longitude', e.target.value)}
                  placeholder="-43.3444"
                  className="h-11"
                />
              </BlocoCampo>

              <MapaVisual latitude={formulario.latitude} longitude={formulario.longitude} />
            </div>

            <div className={classeSecao}>
              <div className="flex flex-col gap-2">
                <h2 className="lafam-text-label text-base text-[#0A0A0A]">{t('postForm.images')}</h2>
                <p className="lafam-text-helper">Selecione as imagens da galeria e defina uma capa para a postagem.</p>
              </div>
              <SeletorImagensDrive
                thumb={formulario.thumb}
                galeria={formulario.galeria}
                definirThumb={aoDefinirThumb}
                definirGaleria={aoDefinirGaleria}
                removerImagem={aoRemoverImagem}
              />
            </div>
          </div>
          </div>
        </form>
      </section>
    </Container>
  );
};

export default FormularioPostagem;
