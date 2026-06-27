import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { encerrarSessao, usuarioEstaAutenticado } from '../ajudantes/autenticacao';

const Cabecalho = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const estaAutenticado = usuarioEstaAutenticado();

  const sair = () => {
    encerrarSessao();
    navigate({ to: '/login' });
  };

  const rotasAdmin = location.pathname.startsWith('/admin/');

  return (
    <header className="cabecalho">
      <div className="cabecalho__miolo">
        <Link to="/" className="cabecalho__marca">
          LAFAM
        </Link>

        <nav className="cabecalho__nav">
          <Link to="/">Início</Link>
          <Link to="/galeria">Galeria</Link>
          {estaAutenticado ? (
            <>
              <Link to="/admin/postagens">Admin</Link>
              <Link to="/admin/nova-postagem">Nova postagem</Link>
              <button type="button" onClick={sair} className="cabecalho__botao-link">
                Sair
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>

      {rotasAdmin && (
        <div className="cabecalho__faixa-admin">
          Área administrativa
        </div>
      )}
    </header>
  );
};

export default Cabecalho;
