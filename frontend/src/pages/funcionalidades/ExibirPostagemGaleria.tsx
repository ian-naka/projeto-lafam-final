import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PostGaleriaCard from '../../components/postagem/PostGaleriaCard';
import PaginationFooter from '../../components/postagem/PaginationFooter';

interface Postagem {
    id: number;
    slug: string;
    titulo: string;
    resumo: string;
    thumb: string;
    categoria: string;
}

const ExibirPostagemGaleria: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [registros, setRegistros] = useState<Postagem[]>([]);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //obter a página atual
    const paginaAtual = parseInt(searchParams.get('pagina') || '1', 10);
    const limit = 50;

    //formata a categoria para exibição
    const categoriaFormatada = category
        ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
        : '';

    useEffect(() => {
        const fetchRegistros = async () => {
            setIsLoading(true);
            setError(null);
            try {
                //determina a url da api baseada na estrutura do projeto
                const baseUrl = 'http://localhost:4000';
                const response = await fetch(`${baseUrl}/registros/categoria/${category}?limit=${limit}&pagina=${paginaAtual}`);

                if (!response.ok) {
                    throw new Error('Falha ao buscar registros');
                }

                const data = await response.json();

                setRegistros(data.registros);
                setTotalPaginas(data.totalPaginas || 1);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro ao carregar os dados.');
            } finally {
                setIsLoading(false);
            }
        };

        if (category) {
            fetchRegistros();
        }
    }, [category, paginaAtual]);

    const handlePageChange = (novaPagina: number) => {
        setSearchParams({ pagina: novaPagina.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <h1 className="text-center text-4xl font-bold font-serif text-gray-900 mb-16">
                Galeria de {categoriaFormatada}
            </h1>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <p className="text-gray-500 font-sans">Carregando acervo...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <p className="text-red-500 font-sans">{error}</p>
                </div>
            ) : registros.length === 0 ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <p className="text-gray-500 font-sans">Nenhum registro encontrado nesta categoria.</p>
                </div>
            ) : (
                <>
                    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {registros.map((post) => (
                            <PostGaleriaCard key={post.id} post={post} />
                        ))}
                    </div>

                    <PaginationFooter
                        currentPage={paginaAtual}
                        totalPages={totalPaginas}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default ExibirPostagemGaleria;
