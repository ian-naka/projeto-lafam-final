import React from 'react';
import { Link } from 'react-router-dom';

const categorias = ['FLORA', 'FUNGA', 'BIOMAS', 'ARQUEOLOGIA', 'FAUNA'];

const Galeria: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pb-20 pt-32">
            <h1 className="text-center text-5xl font-serif text-gray-900 mb-20">
                Galeria
            </h1>
            
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categorias.map((categoria) => (
                        <Link to={`/galeria/${categoria.toLowerCase()}`} key={categoria} className="block">
                            <div 
                                className="group bg-[#2a2a2a] aspect-[3/4] w-full flex items-center justify-center relative cursor-pointer"
                            >
                                <div className="border border-white px-6 py-3 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:border-black">
                                    <span className="text-white group-hover:text-black font-serif uppercase tracking-[0.2em] text-sm font-medium transition-colors duration-300">
                                        {categoria}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Galeria;
