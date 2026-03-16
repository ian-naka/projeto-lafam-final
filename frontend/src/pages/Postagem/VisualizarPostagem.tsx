import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/avada-post.css';

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
        <div id="wrapper" className="pt-[106px]">
            <main id="main">

                {/* hero banner (fusion-fullwidth) com a thumb gerada localmente */}
                <div
                    className="fusion-fullwidth fullwidth-box width-100"
                    style={{
                        backgroundImage: `url('http://localhost:4000${registro.thumb}')`,
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        paddingTop: '250px',
                        paddingBottom: '250px',
                        position: 'relative'
                    }}
                >
                    {/* camada escurecedora opcional caso a foto seja muito clara */}
                    <div className="absolute inset-0 bg-black/40 z-0"></div>
                    <div className="fusion-row relative z-10 flex flex-col items-center justify-center h-full">
                        {/* você pode colocar o título aqui se o tema avada exigir, ou no corpo abaixo */}
                    </div>
                </div>

                {/* container principal flexível do avada */}
                <div className="fusion-flex-container mt-12 mb-12 px-6">
                    <div className="fusion-row gap-10 max-w-[1200px] mx-auto">

                        {/* coluna principal (aproximadamente 2/3) */}
                        <div className="fusion-layout-column fusion_builder_column w-full md:w-[65%] shrink-0">
                            <div className="fusion-column-wrapper">

                                <div className="post-content font-sans">
                                    <div className="flex justify-start mb-4">
                                        <span className="text-[#a5002c] text-[13px] font-bold uppercase tracking-[0.2em] border border-[#a5002c] px-4 py-1">
                                            {registro.categoria}
                                        </span>
                                    </div>

                                    <h1 className="text-[#181818] text-4xl font-light mb-6">
                                        {registro.titulo}
                                    </h1>

                                    {registro.resumo && (
                                        <p className="text-xl text-gray-500 font-light italic leading-relaxed mb-8 border-l-4 border-gray-200 pl-6">
                                            {registro.resumo}
                                        </p>
                                    )}

                                    {/* renderização da descrição mantendo as quebras de linha ou html se houver configurado */}
                                    <div
                                        className="text-gray-700 leading-loose text-[16px] mb-12 whitespace-pre-line"
                                        dangerouslySetInnerHTML={{ __html: registro.descricao }}
                                    />

                                    {/* renderização de coordenadas e mapa google, caso exista */}
                                    {lat && lng && (
                                        <div className="mt-12 mb-12">
                                            <div className="fusion-title fusion-title-size-three mb-6">
                                                <h3 className="font-semibold text-gray-800 uppercase tracking-widest text-sm m-0">
                                                    localização de ocorrência
                                                </h3>
                                            </div>
                                            <p className="text-gray-500 mb-4 font-mono text-sm">{registro.coordenadas}</p>
                                            <div className="w-full h-[400px] bg-gray-100 border border-gray-200">
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
                                        </div>
                                    )}

                                    {/* grade da galeria na coluna principal */}
                                    {registro.galeria && registro.galeria.length > 0 && (
                                        <div className="mt-12 pt-10 border-t border-gray-200">
                                            <div className="fusion-title fusion-title-size-three mb-8">
                                                <h3 className="font-semibold text-gray-800 uppercase tracking-widest text-sm m-0">
                                                    galeria de imagens
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                {registro.galeria.map((link, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`http://localhost:4000${link}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block h-[200px] w-full overflow-hidden bg-gray-100 border border-gray-200 hover:opacity-80 transition-opacity"
                                                    >
                                                        <img
                                                            src={`http://localhost:4000${link}`}
                                                            alt={`registro fotográfico ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* barra lateral (aproximadamente 1/3) */}
                        <div className="fusion-layout-column fusion_builder_column w-full md:w-[30%] shrink-0">
                            <div className="fusion-column-wrapper bg-[#f9f9f9] border-t-4 border-[#a5002c] p-8 shadow-sm">
                                <h3 className="text-[#181818] font-bold uppercase tracking-widest text-sm mb-6 pb-4 border-b border-gray-200">
                                    dados sistemáticos / taxonômicos
                                </h3>

                                <ul className="space-y-4 text-[15px] text-gray-600 font-sans">
                                    <li>
                                        <strong className="text-gray-900 block text-xs uppercase tracking-wider mb-1">localidade</strong>
                                        {registro.localidade}
                                    </li>
                                    <li>
                                        <strong className="text-gray-900 block text-xs uppercase tracking-wider mb-1">data de submissão</strong>
                                        {new Date(registro.createdAt).toLocaleDateString('pt-BR')}
                                    </li>
                                </ul>

                                {registro.tags && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <strong className="text-gray-900 block text-xs uppercase tracking-wider mb-3">etiquetas (tags)</strong>
                                        <div className="flex flex-wrap gap-2">
                                            {registro.tags.split(',').map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-gray-200 text-gray-700 text-[11px] uppercase tracking-wider px-3 py-1 rounded-sm"
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default VisualizarPostagem;
