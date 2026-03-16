import React from 'react';

interface PainelPrincipalProps {
  formData: {
    titulo: string;
    slug: string;
    resumo: string;
    descricao: string;
    citacao: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  gerarSlug: () => void;
}

const PainelPrincipal: React.FC<PainelPrincipalProps> = ({ formData, handleInputChange, gerarSlug }) => {
  return (
    <div className="flex-grow flex flex-col gap-6">
      <div className="bg-white p-0 shadow-sm border border-gray-200">
        <input 
          type="text" 
          name="titulo" 
          value={formData.titulo} 
          onChange={handleInputChange} 
          placeholder="adicionar título" 
          required 
          onBlur={gerarSlug} 
          className="w-full text-xl p-4 border-none focus:ring-0 outline-none placeholder:text-gray-400" 
        />
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-500 flex items-center">
          <span>link permanente:</span>
          <input 
            type="text" 
            name="slug" 
            value={formData.slug} 
            onChange={handleInputChange} 
            className="ml-2 bg-transparent border-b border-gray-300 focus:border-[#a5002c] outline-none text-gray-700 w-1/2" 
          />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">resumo da postagem</h2>
        </div>
        <div className="p-4">
          <textarea 
            name="resumo" 
            value={formData.resumo} 
            onChange={handleInputChange} 
            rows={3} 
            className="w-full border border-gray-300 p-3 focus:border-[#a5002c] outline-none resize-none" 
          />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">citação (opcional)</h2>
        </div>
        <div className="p-4">
          <textarea 
            name="citacao" 
            value={formData.citacao} 
            onChange={handleInputChange} 
            rows={2} 
            placeholder="Exemplo de citação bibliográfica ou de fonte"
            className="w-full border border-gray-300 p-3 focus:border-[#a5002c] outline-none resize-none" 
          />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">descrição detalhada</h2>
        </div>
        <div className="p-4">
          <textarea 
            name="descricao" 
            value={formData.descricao} 
            onChange={handleInputChange} 
            rows={10} 
            className="w-full border border-gray-300 p-3 focus:border-[#a5002c] outline-none resize-none" 
          />
        </div>
      </div>
    </div>
  );
};

export default PainelPrincipal;
