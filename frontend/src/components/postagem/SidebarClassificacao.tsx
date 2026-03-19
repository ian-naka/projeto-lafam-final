import React from 'react';
import useDrivePicker from 'react-google-drive-picker';

interface SidebarClassificacaoProps {
  formData: {
    categoria: string;
    localidade: string;
    tags: string;
    thumb: string;
    galeria: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const SidebarClassificacao: React.FC<SidebarClassificacaoProps> = ({ formData, setFormData, handleInputChange }) => {
  const [openPicker] = useDrivePicker();

  const handleOpenPickerThumb = () => {
    openPicker({
      developerKey: import.meta.env.VITE_GOOGLE_API_KEY,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      viewId: "DOCS_IMAGES",
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
        }
        if (data.docs && data.docs.length > 0) {
          setFormData((prev: any) => ({ ...prev, thumb: data.docs[0].id }));
        }
      },
    });
  };

  const handleOpenPickerGaleria = () => {
    openPicker({
      developerKey: import.meta.env.VITE_GOOGLE_API_KEY,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      viewId: "DOCS_IMAGES",
      callbackFunction: (data) => {
        if (data.docs && data.docs.length > 0) {
          const ids = data.docs.map(doc => doc.id);
          setFormData((prev: any) => ({ ...prev, galeria: ids }));
        }
      },
    });
  };

  return (
    <>
      <div className="bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
          Classificação
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Categoria Principal</label>
            <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full border border-gray-300 p-2 outline-none focus:border-[#a5002c]">
              <option value="Flora">Flora</option>
              <option value="Funga">Funga</option>
              <option value="Biomas">Biomas</option>
              <option value="Arqueologia">Arqueologia</option>
              <option value="Fauna">Fauna</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Localidade</label>
            <input type="text" name="localidade" value={formData.localidade} onChange={handleInputChange} className="w-full border border-gray-300 p-2 outline-none focus:border-[#a5002c]" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Tags (Vírgula)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full border border-gray-300 p-2 outline-none focus:border-[#a5002c]" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
          Imagens (Google Drive)
        </div>
        <div className="p-4 flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-600 block mb-2 font-medium">Imagem de Capa (Thumbnail)</label>
            <button
              type="button"
              onClick={handleOpenPickerThumb}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 text-sm font-medium border border-gray-300 transition-colors"
            >
              {formData.thumb ? '✓ Capa Selecionada' : 'Selecionar Capa do Drive'}
            </button>
            {formData.thumb && <p className="text-[10px] text-green-600 mt-1 truncate">ID: {formData.thumb}</p>}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="text-sm text-gray-600 block mb-2 font-medium">Galeria (Várias Imagens)</label>
            <button
              type="button"
              onClick={handleOpenPickerGaleria}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 text-sm font-medium border border-gray-300 transition-colors"
            >
              {formData.galeria && formData.galeria.length > 0 
                ? `✓ ${formData.galeria.length} fotos selecionadas` 
                : 'Selecionar Fotos da Galeria'}
            </button>
            {formData.galeria && formData.galeria.length > 0 && (
              <div className="mt-2 max-h-20 overflow-y-auto border border-gray-100 p-1">
                {formData.galeria.map(id => (
                  <p key={id} className="text-[9px] text-gray-400 truncate">{id}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarClassificacao;
