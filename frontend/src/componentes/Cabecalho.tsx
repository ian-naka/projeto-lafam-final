import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { encerrarSessao, usuarioEstaAutenticado } from '../ajudantes/autenticacao';

const Cabecalho = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const estaAutenticado = usuarioEstaAutenticado();
  const { t } = useTranslation();

  const sair = () => {
    encerrarSessao();
    navigate({ to: '/login' });
  };

  const rotasAdmin = location.pathname.startsWith('/admin/');

  return (
    <header className="cabecalho">
      <div className="cabecalho__miolo">
        <Link to="/" className="cabecalho__marca">
          {t('common.appName')}
        </Link>

        <nav className="cabecalho__nav">
          <Link to="/">{t('navigation.home')}</Link>
          <Link to="/galeria">{t('navigation.gallery')}</Link>
          {estaAutenticado ? (
            <>
              <Link to="/admin/postagens">{t('navigation.admin')}</Link>
              <Link to="/admin/nova-postagem">{t('navigation.newPost')}</Link>
              <button type="button" onClick={sair} className="cabecalho__botao-link">
                {t('common.logout')}
              </button>
            </>
          ) : (
            <Link to="/login">{t('common.login')}</Link>
          )}
        </nav>
      </div>

      {rotasAdmin && (
        <div className="cabecalho__faixa-admin">
          {t('common.adminArea')}
        </div>
      )}
    </header>
  );
};

export default Cabecalho;
