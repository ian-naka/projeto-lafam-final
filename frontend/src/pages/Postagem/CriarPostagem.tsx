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
        galeriaLinks: '',
        categoria: 'Flora',
        tags: '',
        localidade: '',
        coordenadas: '',
        citacao: ''
    });

    const [arquivos, setArquivos] = useState<{ thumbFile: File | null; galeriaFiles: FileList | null }>({
        thumbFile: null,
        galeriaFiles: null
    });

    const { setFlashMessage } = useFlashMessage();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // tratamento especial para inputs de arquivo
        if (type === 'file') {
            const inputElement = e.target as HTMLInputElement;
            setArquivos({
                ...arquivos,
                [name]: name === 'thumbFile' && inputElement.files ? inputElement.files[0] : inputElement.files
            });
            return;
        }

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

        // sanitização e preparo do payload em FormData
        const payloadFormData = new FormData();
        payloadFormData.append('titulo', sanitizarTextoSimples(formData.titulo));
        payloadFormData.append('resumo', sanitizarTextoSimples(formData.resumo));
        payloadFormData.append('coordenadas', formData.coordenadas.trim());
        payloadFormData.append('slug', formData.slug.trim());
        payloadFormData.append('descricao', formData.descricao.trim());
        payloadFormData.append('categoria', formData.categoria.trim());
        payloadFormData.append('tags', formData.tags.trim());
        payloadFormData.append('localidade', formData.localidade.trim());
        payloadFormData.append('citacao', formData.citacao.trim());

        // append dos arquivos
        if (arquivos.thumbFile) {
            payloadFormData.append('thumbFile', arquivos.thumbFile);
        }

        if (arquivos.galeriaFiles) {
            for (let i = 0; i < arquivos.galeriaFiles.length; i++) {
                payloadFormData.append('galeriaFiles', arquivos.galeriaFiles[i]);
            }
        }

        try {
            const token = localStorage.getItem('token');
            const resposta = await fetch('http://localhost:4000/registros', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: payloadFormData
            });

            const dados = await resposta.json();

            // lida com o erro 404 ou outros erros do servidor
            if (!resposta.ok) throw new Error(`erro ${resposta.status}: ${dados.message || 'falha na comunicação com o servidor.'}`);

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