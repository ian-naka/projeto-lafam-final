import { useTranslation } from 'react-i18next';
import { useGooglePickerLafam } from '../hooks/useGooglePickerLafam';

interface SeletorImagensDriveProps {
  thumb: string;
  galeria: string[];
  definirThumb: (id: string) => void;
  definirGaleria: (ids: string[]) => void;
  removerImagem: (id: string) => void;
}

const SeletorImagensDrive = ({
  thumb,
  galeria,
  definirThumb,
  definirGaleria,
  removerImagem,
}: SeletorImagensDriveProps) => {
  const { selecionarUmaImagem, selecionarVariasImagens } = useGooglePickerLafam();
  const { t } = useTranslation();

  const abrirSeletorThumb = () => {
    selecionarUmaImagem(definirThumb);
  };

  const abrirSeletorGaleria = () => {
    selecionarVariasImagens(definirGaleria);
  };

  return (
    <div className="seletor-drive">
      <div className="seletor-drive__acoes">
        <button type="button" onClick={abrirSeletorGaleria}>
          {t('drivePicker.selectGalleryImages')}
        </button>
        <button type="button" onClick={abrirSeletorThumb}>
          {t('drivePicker.selectCoverImage')}
        </button>
      </div>

      <div className="seletor-drive__estado">
        <p><strong>{t('drivePicker.cover')}</strong> {thumb || t('drivePicker.coverEmpty')}</p>
        <p>{t('drivePicker.galleryCount', { count: galeria.length })}</p>
      </div>

      {galeria.length > 0 && (
        <div className="seletor-drive__lista">
          {galeria.map((id) => (
            <div key={id} className="seletor-drive__item">
              <span>{id}</span>
              <div className="seletor-drive__item-acoes">
                {thumb !== id && (
                  <button type="button" onClick={() => definirThumb(id)}>
                    {t('drivePicker.setAsCover')}
                  </button>
                )}
                <button type="button" onClick={() => removerImagem(id)}>
                  {t('drivePicker.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeletorImagensDrive;
