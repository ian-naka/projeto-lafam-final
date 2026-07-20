import { useEffect, useState } from 'react';
import type { Categoria } from '@lafam/back-front';
import arqueologiaImage from '../assets/arqueologia.png';
import biomasImage from '../assets/biomas.png';
import faunaImage from '../assets/fauna.png';
import floraImage from '../assets/flora.png';
import fungaImage from '../assets/funga.png';
import { GaleriaCard } from '../componentes/galeria';
import { useResponsividade } from '../hooks';
import { listarCategorias } from '../servicos/categorias';

const imagemPorCategoria: Record<string, string> = {
  arqueologia: arqueologiaImage,
  biomas: biomasImage,
  fauna: faunaImage,
  flora: floraImage,
  funga: fungaImage,
};

const Galeria = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { ehCelular, ehTablet, ehDesktopCompacto } = useResponsividade();

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  return (
    <section
      className={`pagina flex flex-col ${
        ehCelular ? 'gap-4 pt-12 pb-8' : ehTablet ? 'gap-5 pt-14 pb-10' : 'min-h-[calc(100dvh-12rem)] pb-10'
      }`}
    >
      <div className={`flex justify-center ${ehCelular ? '' : ehTablet ? 'pb-1' : 'flex-1 items-center'}`}>
        <h1 className="lafam-text-display text-center">Galeria</h1>
      </div>

      <div
        className={`grid gap-4 ${
          ehCelular
            ? 'grid-cols-1'
            : ehTablet
              ? 'grid-cols-2'
              : ehDesktopCompacto
                ? 'grid-cols-3'
                : 'grid-cols-5'
        }`}
      >
        {categorias.map((categoria) => (
          <GaleriaCard
            key={categoria.slug}
            imagem={imagemPorCategoria[categoria.slug]}
            nome={categoria.nome}
            slug={categoria.slug}
            tamanho={ehCelular ? 'mobile' : ehTablet ? 'tablet' : ehDesktopCompacto ? 'compacto' : 'padrao'}
          />
        ))}
      </div>
    </section>
  );
};

export default Galeria;
