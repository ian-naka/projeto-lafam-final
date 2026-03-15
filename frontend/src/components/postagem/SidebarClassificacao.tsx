import React from 'react';

interface SidebarClassificacaoProps {
  formData: {
    categoria: string;
    localidade: string;
    tags: string;
    thumb: string;
    galeriaLinks: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const SidebarClassificacao: React.FC<SidebarClassificacaoProps> = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
          classificação
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">categoria principal</label>
            <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full border border-gray-300 p-2 outline-none focus:border-[#a5002c]">
              <option value="Flora">Flora</option>
              <option value="Funga">Funga</option>
              <option value="Biomas">Biomas</option>
              <option value="Arqueologia">Arqueologia</option>
              <option value="Fauna">Fauna</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">localidade</label>
            <input type="text" name="localidade" value={formData.localidade} onChange={handleInputChange} className="w-full border border-gray-300 p-2 outline-none focus:border-[#a5002c]" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">tags (vírgula)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full border border-gray-300 p-2 outline-none focus:border-[#a5002c]" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
          imagens (links do drive)
        </div>
        <div className="p-4 flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-600 block mb-1 font-medium">link da capa (thumbnail)</label>
            <input 
              type="text" 
              name="thumb" 
              value={formData.thumb} 
              onChange={handleInputChange} 
              placeholder="cole o link de partilha aqui..." 
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#a5002c]" 
            />
            <p className="text-[11px] text-gray-500 mt-1">lembre-se de deixar a imagem com acesso "qualquer pessoa com o link".</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="text-sm text-gray-600 block mb-1 font-medium">galeria (vários links)</label>
            <textarea 
              name="galeriaLinks" 
              value={formData.galeriaLinks} 
              onChange={handleInputChange} 
              placeholder="cole os links separados por vírgula ou quebra de linha..." 
              rows={4}
              className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#a5002c] resize-none" 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarClassificacao;
