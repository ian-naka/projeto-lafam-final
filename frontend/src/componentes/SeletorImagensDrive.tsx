import { useTranslation } from 'react-i18next';
import { Button } from './botao/Button';
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" className="h-10" onClick={abrirSeletorGaleria}>
          {t('drivePicker.selectGalleryImages')}
        </Button>
        <Button type="button" variant="secondary" className="h-10" onClick={abrirSeletorThumb}>
          {t('drivePicker.selectCoverImage')}
        </Button>
      </div>

      <div className="flex flex-col gap-1 rounded-[12px] border border-[#E5E7EB] bg-[#FCFCFD] px-4 py-3">
        <p className="lafam-text-helper">
          <strong className="text-[#0A0A0A]">{t('drivePicker.cover')}</strong> {thumb || t('drivePicker.coverEmpty')}
        </p>
        <p className="lafam-text-helper">{t('drivePicker.galleryCount', { count: galeria.length })}</p>
      </div>

      {galeria.length > 0 && (
        <div className="flex flex-col gap-2">
          {galeria.map((id) => (
            <div
              key={id}
              className="flex flex-col gap-3 rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <span className="lafam-text-helper overflow-hidden text-ellipsis">{id}</span>
              <div className="flex flex-wrap gap-2">
                {thumb !== id && (
                  <Button type="button" variant="secondary" className="h-9 px-4" onClick={() => definirThumb(id)}>
                    {t('drivePicker.setAsCover')}
                  </Button>
                )}
                <Button type="button" variant="secondary" className="h-9 px-4" onClick={() => removerImagem(id)}>
                  {t('drivePicker.remove')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeletorImagensDrive;
