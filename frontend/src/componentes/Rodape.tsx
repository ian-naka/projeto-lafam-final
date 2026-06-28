import { useTranslation } from 'react-i18next';

const Rodape = () => {
  const { t } = useTranslation();

  return (
    <footer className="rodape">
      <div className="rodape__miolo">
        <p>{t('footer.product')}</p>
        <p>{t('footer.description')}</p>
      </div>
    </footer>
  );
};

export default Rodape;
