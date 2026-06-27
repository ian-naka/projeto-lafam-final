import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { Categoria } from '../tipos/categoria';
import { listarCategorias } from '../servicos/categorias';

const Galeria = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  return (
    <section className="pagina">
      <div className="pagina__topo">
        <h1>Galeria</h1>
        <p>Escolha uma categoria para navegar pelas postagens.</p>
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
