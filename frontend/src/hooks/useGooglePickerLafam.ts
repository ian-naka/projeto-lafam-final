import useDrivePicker from 'react-google-drive-picker';
import { criarConfiguracaoGooglePicker } from '../servicos/googlePicker';

export function useGooglePickerLafam() {
  const [abrirPicker] = useDrivePicker();

  function selecionarUmaImagem(aoSelecionar: (id: string) => void) {
    abrirPicker(
      criarConfiguracaoGooglePicker({
        multiselect: false,
        aoSelecionar: (ids) => {
          if (ids[0]) {
            aoSelecionar(ids[0]);
          }
        },
      })
    );
  }

  function selecionarVariasImagens(aoSelecionar: (ids: string[]) => void) {
    abrirPicker(
      criarConfiguracaoGooglePicker({
        multiselect: true,
        aoSelecionar,
      })
    );
  }

  return {
    selecionarUmaImagem,
    selecionarVariasImagens,
  };
}
