import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { House, ImageIcon, LogIn, LogOut, Menu, Plus, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { encerrarSessao, usuarioEstaAutenticado } from '../../ajudantes/autenticacao';

type ItemSidebar = {
  rota: string;
  rotulo: string;
  icone: typeof ImageIcon | typeof House;
};

const SidebarInicio = () => {
  const [aberta, setAberta] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!aberta) return;

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        setAberta(false);
      }
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', aoPressionarTecla);
    };
  }, [aberta]);

  const navigate = useNavigate();

  const autenticado = usuarioEstaAutenticado();

  const itens = useMemo<ItemSidebar[]>(
    () => [
      {
        rota: '/',
        rotulo: t('navigation.home'),
        icone: House,
      },
      {
        rota: '/galeria',
        rotulo: t('navigation.gallery'),
        icone: ImageIcon,
      },
      {
        rota: '/acervo',
        rotulo: t('navigation.collectionSearch'),
        icone: Search,
      },
    ],
    [t]
  );

  const aoFazerLogout = () => {
    encerrarSessao();
    setAberta(false);
    navigate({ to: '/' });
  };

  return (
    <>
      <button
        type="button"
        className={`pagina-sidebar__trigger ${aberta ? 'pagina-sidebar__trigger--aberta' : ''}`}
        aria-label={aberta ? t('sidebar.close') : t('sidebar.toggle')}
        aria-expanded={aberta}
        onClick={() => setAberta((estadoAtual) => !estadoAtual)}
      >
        {aberta ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`pagina-sidebar__overlay ${aberta ? 'pagina-sidebar__overlay--aberta' : ''}`}
        aria-hidden={!aberta}
        onClick={() => setAberta(false)}
      />

      <aside
        className={`pagina-sidebar ${aberta ? 'pagina-sidebar--aberta' : ''}`}
        aria-hidden={!aberta}
      >
        <div className="pagina-sidebar__topo">
          <Link to="/" className="pagina-sidebar__marca" onClick={() => setAberta(false)}>
            {t('common.appName')}
          </Link>
          <p className="pagina-sidebar__submarca">{t('sidebar.subtitle')}</p>
        </div>

        <nav className="pagina-sidebar__navegacao" aria-label={t('sidebar.navigationLabel')}>
          {itens.map((item) => {
            const ativa = item.rota ? location.pathname === item.rota : false;
            const Icone = item.icone;

            return (
              <Link
                key={`${item.rota}-${item.rotulo}`}
                to={item.rota}
                className={`pagina-sidebar__item ${ativa ? 'pagina-sidebar__item--ativo' : ''}`}
                onClick={() => setAberta(false)}
              >
                <Icone size={18} />
                <span>{item.rotulo}</span>
              </Link>
            );
          })}

          {autenticado ? (
            <>
              <Link
                to="/admin/nova-postagem"
                className={`pagina-sidebar__item ${location.pathname === '/admin/nova-postagem' ? 'pagina-sidebar__item--ativo' : ''}`}
                onClick={() => setAberta(false)}
              >
                <Plus size={18} />
                <span>{t('navigation.newPost')}</span>
              </Link>
              <button
                className="pagina-sidebar__item"
                onClick={aoFazerLogout}
              >
                <LogOut size={18} />
                <span>{t('common.logout')}</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`pagina-sidebar__item ${location.pathname === '/login' ? 'pagina-sidebar__item--ativo' : ''}`}
              onClick={() => setAberta(false)}
            >
              <LogIn size={18} />
              <span>{t('common.login')}</span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};

export default SidebarInicio;
