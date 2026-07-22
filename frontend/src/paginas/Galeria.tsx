import { useEffect, useState } from 'react';
import type { Categoria } from '@lafam/back-front';
import arqueologiaImage from '../assets/arqueologia.png';
import biomasImage from '../assets/biomas.png';
import faunaImage from '../assets/fauna.png';
import floraImage from '../assets/flora.png';
import fungaImage from '../assets/funga.png';
import { GaleriaCard } from '../componentes/galeria';
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

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  return (
    <section className="galeria-pagina">
      <div className="px-4 md:px-6 pt-[15vh] pb-6 md:pb-8">
        <div className="w-full max-w-[1180px] mx-auto">
          <div className="rounded-[24px] border border-gray-200 bg-white px-5 py-4 shadow-sm md:px-6 mb-4">
            <h1 className="lafam-text-display">Galeria</h1>
            <p className="lafam-text-subtitle mt-2">Explore as categorias do acervo do LAFAM.</p>
          </div>

          <div className="flex justify-center gap-4">
            {categorias.map((categoria) => (
              <div key={categoria.slug} className="flex-1 min-w-0 max-w-[220px]">
                <GaleriaCard
                  imagem={imagemPorCategoria[categoria.slug]}
                  nome={categoria.nome}
                  slug={categoria.slug}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Galeria;
