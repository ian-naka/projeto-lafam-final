import React from 'react';

interface PaginationFooterProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-20 mb-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded text-sm font-sans transition-colors ${
                    currentPage === 1 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
            >
                Anterior
            </button>
            
            <span className="px-4 py-2 text-sm font-sans text-gray-700">
                Página {currentPage} de {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded text-sm font-sans transition-colors ${
                    currentPage === totalPages 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
            >
                Próxima
            </button>
        </div>
    );
};

export default PaginationFooter;
