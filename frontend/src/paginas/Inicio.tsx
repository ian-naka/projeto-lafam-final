import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const Inicio = () => {
  const { t } = useTranslation();

  return (
    <section className="pagina">
      <div className="pagina__hero">
        <p className="pagina__sobretitulo">{t('home.eyebrow')}</p>
        <h1>{t('home.title')}</h1>
        <p>{t('home.description')}</p>
        <div className="pagina__acoes">
          <Link to="/galeria" className="botao botao--primario">{t('home.openGallery')}</Link>
          <Link to="/login" className="botao botao--secundario">{t('home.signIn')}</Link>
        </div>
      </div>
    </section>
  );
};

export default Inicio;
