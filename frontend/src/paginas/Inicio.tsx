import { Link } from '@tanstack/react-router';

const Inicio = () => {
  return (
    <section className="pagina">
      <div className="pagina__hero">
        <p className="pagina__sobretitulo">Lafam MVP</p>
        <h1>Catálogo fotográfico ambiental</h1>
        <p>
          Fluxo básico para cadastrar, organizar e publicar registros com resumo,
          localização, categorias, tags, capa e galeria de imagens.
        </p>
        <div className="pagina__acoes">
          <Link to="/galeria" className="botao botao--primario">Abrir galeria</Link>
          <Link to="/login" className="botao botao--secundario">Entrar</Link>
        </div>
      </div>
    </section>
  );
};

export default Inicio;
