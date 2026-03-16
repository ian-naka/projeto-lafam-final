import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// interface baseada no model do backend
interface Registro {
    id: number;
    titulo: string;
    slug: string;
    resumo: string;
    descricao: string;
    thumb: string;
    galeria?: string[];
    categoria: string;
    tags?: string;
    localidade: string;
    coordenadas?: string;
    createdAt: string;
    citacao?: string;
}

const VisualizarPostagem = () => {
    const { slug } = useParams<{ slug: string }>();
    const [registro, setRegistro] = useState<Registro | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegistro = async () => {
            try {
                // tenta obter registro com token se logado, mas backend permite acesso sem token?
                // nota: o route router.get('/:slug') no postagemRoutes.ts não tem verifyToken, então é publico!
                const res = await fetch(`http://localhost:4000/registros/${slug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!res.ok) {
                    if (res.status === 404) throw new Error('registro não encontrado.');
                    throw new Error('erro ao carregar o registro.');
                }

                const data = await res.json();
                setRegistro(data);
            } catch (err: any) {
                setError(err.message || 'erro desconhecido.');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistro();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-sans">
                <p className="text-gray-500 text-lg tracking-widest uppercase">carregando acervo...</p>
            </div>
        );
    }

    if (error || !registro) {
        return (
            <div className="min-h-screen flex items-center justify-center font-sans bg-[#f1f1f1]">
                <div className="max-w-[600px] bg-white border-l-4 border-[#a5002c] p-8 shadow-sm text-center">
                    <h2 className="text-2xl text-[#181818] mb-4">erro ao buscar do acervo</h2>
                    <p className="text-[#a5002c]">{error}</p>
                    <a href="/" className="mt-6 inline-block bg-[#181818] text-white px-6 py-2 uppercase text-sm tracking-widest">voltar para o início</a>
                </div>
            </div>
        );
    }

    // processamento geográfico
    let lat = '', lng = '';
    if (registro.coordenadas) {
        const coordParts = registro.coordenadas.split(',').map(c => c.trim());
        if (coordParts.length === 2) {
            lat = coordParts[0];
            lng = coordParts[1];
        }
    }

    return (
        <div className="min-h-screen bg-white text-[#181818] pt-32 pb-20 px-6 font-sans">
            <h1 className="text-center text-4xl font-bold text-gray-900 mb-16">
                {registro.titulo}
            </h1>

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">

                {/* Coluna da Esquerda (Imagens e Mapa) */}
                <div className="md:col-span-4 flex flex-col">
                    {/* Galeria de Imagens (Apenas Galeria no map) */}
                    {registro.galeria && registro.galeria.length > 0 && (
                        registro.galeria.map((link, idx) => (
                            <img
                                key={idx}
                                src={`http://localhost:4000${link}`}
                                alt={`registro fotográfico ${idx + 1}`}
                                className="w-full h-auto rounded-md object-cover mb-4 border border-gray-200"
                                loading="lazy"
                            />
                        ))
                    )}

                    {/* Localização e Mapa */}
                    {lat && lng && (
                        <>
                            <h3 className="text-xl font-bold mt-10 mb-4 text-black">
                                Local aproximado
                            </h3>
                            <div className="w-full h-[300px] bg-gray-100 border border-gray-200 rounded-md overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=${lat},${lng}&hl=pt-BR&z=15&output=embed`}
                                    title="mapa ocorrência google maps"
                                    allowFullScreen
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Coluna da Direita (Descrição e Citação) */}
                <div className="md:col-span-8 flex flex-col items-start">

                    {/* Descrição Detalhada */}
                    <div
                        className="text-gray-800 leading-relaxed text-[15px] whitespace-pre-line desc-content w-full"
                        dangerouslySetInnerHTML={{ __html: registro.descricao }}
                    />

                    {/* Citação Formatada */}
                    {registro.citacao && (
                        <div className="mt-16 w-full flex items-start">
                            <p className="w-[100px] shrink-0 text-gray-800 font-medium">Citação:</p>
                            <div className="flex-grow border border-gray-200 bg-[#fbfbfb] p-4 text-sm font-mono text-gray-700 relative rounded-md">

                                {registro.citacao}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualizarPostagem;
