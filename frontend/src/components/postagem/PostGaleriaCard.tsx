import React from 'react';
import { Link } from 'react-router-dom';

interface PostGaleriaCardProps {
    post: {
        slug: string;
        titulo: string;
        resumo: string;
        thumb: string;
    };
}

const PostGaleriaCard: React.FC<PostGaleriaCardProps> = ({ post }) => {
    // Usar API url para os uploads
    const baseUrl = 'http://localhost:4000'; // Porta correta do backend
    
    return (
        <Link to={`/acervo/${post.slug}`} className="block">
            <div className="bg-transparent border-none overflow-visible relative transition-transform duration-300 hover:-translate-y-2 cursor-pointer group">
                <img 
                    src={`${baseUrl}/registros/imagens/${post.thumb}`} 
                    alt={post.titulo} 
                    className="relative z-10 w-full aspect-[4/3] object-cover shadow-lg" 
                />
                <div className="relative z-20 bg-white pt-6 px-4 pb-4 -mt-16 ml-8 w-auto flex flex-col items-center text-center gap-3 shadow-md">
                    <h3 className="text-black font-serif font-bold text-xl transition-colors duration-300 group-hover:text-[#0078a8]">
                        {post.titulo}
                    </h3>
                    <p className="text-sm font-sans text-gray-600 whitespace-pre-line line-clamp-3 leading-relaxed">
                        {post.resumo}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default PostGaleriaCard;
