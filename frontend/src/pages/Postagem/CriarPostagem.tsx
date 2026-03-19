import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PainelPrincipal from '../../components/postagem/PainelPrincipal';
import SidebarClassificacao from '../../components/postagem/SidebarClassificacao';
import MapaGoogle from '../../components/postagem/MapaGoogle';
import { sanitizarTextoSimples } from '../../helpers/sanitizacao';
import useFlashMessage from '../../hooks/useFlashMessage';

const CriarPostagem = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: '',
        slug: '',
        resumo: '',
        descricao: '',
        thumb: '',
        galeria: [] as string[],
        categoria: 'Flora',
        tags: '',
        localidade: '',
        coordenadas: '',
        citacao: ''
    });

    const { setFlashMessage } = useFlashMessage();

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

        // preparo do payload em JSON
        const payload = {
            ...formData,
            titulo: sanitizarTextoSimples(formData.titulo),
            resumo: sanitizarTextoSimples(formData.resumo),
            coordenadas: formData.coordenadas.trim(),
            slug: formData.slug.trim(),
            descricao: formData.descricao.trim(),
            categoria: formData.categoria.trim(),
            tags: formData.tags.trim(),
            localidade: formData.localidade.trim(),
            citacao: formData.citacao.trim(),
        };

        try {
            const token = localStorage.getItem('token');
            const resposta = await fetch('http://localhost:4000/registros', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const dados = await resposta.json();

            // LÓGICA ATUALIZADA: Captura os erros detalhados do Zod
            if (!resposta.ok) {
                if (dados.errors && Array.isArray(dados.errors)) {
                    // Se houver vários erros, junta eles com uma barra
                    throw new Error(dados.errors.join(' | ')); 
                }
                throw new Error(dados.message || 'Falha na comunicação com o servidor.');
            }

            setFlashMessage('registro postado com sucesso!', 'success');
            navigate(`/acervo/${formData.slug.trim()}`);
        } catch (error) {
            setFlashMessage(error instanceof Error ? error.message : String(error), 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f1f1] px-6 pb-6 pt-[120px] font-sans">

            {/* barra superior (header do editor) */}
            <div className="max-w-[1200px] mx-auto flex justify-between items-center mb-6">
                <h1 className="text-2xl text-[#181818] font-normal">
                    Adicionar Novo Registro
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
                        setFormData={setFormData}
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