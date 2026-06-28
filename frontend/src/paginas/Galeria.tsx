import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { Categoria } from '@lafam/back-front';
import { listarCategorias } from '../servicos/categorias';

const Galeria = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  return (
    <section className="pagina">
      <div className="pagina__topo">
        <h1>{t('gallery.title')}</h1>
        <p>{t('gallery.subtitle')}</p>
      </div>

      <div className="grade-categorias">
        {categorias.map((categoria) => (
          <Link
            key={categoria.slug}
            to="/galeria/$slugCategoria"
            params={{ slugCategoria: categoria.slug }}
            className="card-categoria"
          >
            {categoria.nome}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Galeria;
