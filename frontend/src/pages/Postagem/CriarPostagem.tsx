import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PainelPrincipal from '../../components/postagem/PainelPrincipal';
import SidebarClassificacao from '../../components/postagem/SidebarClassificacao';
import MapaGoogle from '../../components/postagem/MapaGoogle';
import { sanitizarTextoSimples } from '../../helpers/sanitizacao';

const CriarPostagem = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: '',
        slug: '',
        resumo: '',
        descricao: '',
        thumb: '',
        galeriaLinks: '',
        categoria: 'Flora',
        tags: '',
        localidade: '',
        coordenadas: ''
    });

    const [mensagem, setMensagem] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let valorVigente = value;

        // sanitização em tempo real (bloqueia a digitação de caracteres não permitidos)
        if (name === 'coordenadas') {
            // permite apenas números, ponto, vírgula, espaço e sinal de menos
            valorVigente = value.replace(/[^\d.,\- ]/g, '');
        }

        if (name === 'slug') {
            // permite apenas letras minúsculas, números e hifens
            valorVigente = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        }

        setFormData({ ...formData, [name]: valorVigente });
    };

    const gerarSlug = () => {
        const novoSlug = formData.titulo.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        setFormData({ ...formData, slug: novoSlug });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem('');

        // limpeza do array de galeria links (vírgula ou quebra de linha)
        const arrayGaleria = formData.galeriaLinks
            .split(/[,\n]/)
            .map(link => link.trim())
            .filter(link => link !== '');

        // sanitização e preparo do payload
        const payload = {
            ...formData,
            titulo: sanitizarTextoSimples(formData.titulo),
            resumo: sanitizarTextoSimples(formData.resumo),
            coordenadas: formData.coordenadas.trim(), // sanitização regex está no backend, mas aqui evitamos espaços
            slug: formData.slug.trim(),
            descricao: formData.descricao.trim(),
            thumb: formData.thumb.trim(),
            categoria: formData.categoria.trim(),
            tags: formData.tags.trim(),
            localidade: formData.localidade.trim(),
            galeria: arrayGaleria
        };

        try {
            const token = localStorage.getItem('token');
            const resposta = await fetch('http://localhost:3000/registros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const dados = await resposta.json();

            // lida com o erro 404 ou outros erros do servidor
            if (!resposta.ok) throw new Error(`erro ${resposta.status}: ${dados.message || 'falha na comunicação com o servidor.'}`);

            alert('registro postado com sucesso!');
            navigate('/');
        } catch (error) {
            setMensagem(error instanceof Error ? error.message : String(error));
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f1f1] px-6 pb-6 pt-[120px] font-sans">

            {/* barra superior (header do editor) */}
            <div className="max-w-[1200px] mx-auto flex justify-between items-center mb-6">
                <h1 className="text-2xl text-[#181818] font-normal">
                    adicionar novo registro
                </h1>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-[#181818] hover:bg-[#333333] text-white px-6 py-1.5 shadow-sm rounded-sm transition-colors cursor-pointer"
                    >
                        publicar
                    </button>
                </div>
            </div>

            {mensagem && (
                <div className="max-w-[1200px] mx-auto bg-white border-l-4 border-[#a5002c] p-4 mb-6 shadow-sm">
                    <p className="text-[#a5002c] font-medium">{mensagem}</p>
                    {mensagem.includes('404') && <p className="text-sm text-gray-600 mt-1">lembrete: a rota do backend ainda precisa ser criada!</p>}
                </div>
            )}

            {/* modo formulário com componentes extraídos */}
            <form id="post-form" className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6">

                {/* coluna principal (esquerda) */}
                <PainelPrincipal
                    formData={formData}
                    handleInputChange={handleInputChange}
                    gerarSlug={gerarSlug}
                />

                {/* barra lateral (direita) */}
                <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
                    <SidebarClassificacao
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />

                    <MapaGoogle
                        coordenadas={formData.coordenadas}
                        handleInputChange={handleInputChange}
                    />
                </div>
            </form>
        </div>
    );
};

export default CriarPostagem;