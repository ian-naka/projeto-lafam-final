export interface DocumentoGoogleDrive {
  id: string;
}

export interface RespostaGooglePicker {
  docs?: DocumentoGoogleDrive[];
}

export interface ConfiguracaoGooglePicker {
  multiselect: boolean;
  aoSelecionar: (ids: string[]) => void;
}

export function criarConfiguracaoGooglePicker({
  multiselect,
  aoSelecionar,
}: ConfiguracaoGooglePicker) {
  const developerKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const appId = import.meta.env.VITE_GOOGLE_APP_ID;

  if (!developerKey || !clientId || !appId) {
    throw new Error('Configure VITE_GOOGLE_API_KEY, VITE_GOOGLE_CLIENT_ID e VITE_GOOGLE_APP_ID para usar o seletor do Google Drive.');
  }

  return {
    developerKey,
    clientId,
    appId,
    showUploadView: true,
    showUploadFolders: true,
    supportDrives: true,
    multiselect,
    viewId: 'DOCS_IMAGES' as const,
    callbackFunction: (dados: RespostaGooglePicker) => {
      if (dados.docs && dados.docs.length > 0) {
        aoSelecionar(dados.docs.map((documento) => documento.id));
      }
    },
  };
}
