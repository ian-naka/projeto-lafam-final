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
          Selecionar imagens da galeria
        </button>
        <button type="button" onClick={abrirSeletorThumb}>
          Selecionar imagem de capa
        </button>
      </div>

      <div className="seletor-drive__estado">
        <p><strong>Capa:</strong> {thumb || 'Nenhuma selecionada'}</p>
        <p><strong>Galeria:</strong> {galeria.length} imagem(ns)</p>
      </div>

      {galeria.length > 0 && (
        <div className="seletor-drive__lista">
          {galeria.map((id) => (
            <div key={id} className="seletor-drive__item">
              <span>{id}</span>
              <div className="seletor-drive__item-acoes">
                {thumb !== id && (
                  <button type="button" onClick={() => definirThumb(id)}>
                    Definir como capa
                  </button>
                )}
                <button type="button" onClick={() => removerImagem(id)}>
                  Remover
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
