import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#181818] text-[#a0a0a0] pt-[80px] pb-[30px] px-6 font-sans text-[13px]">
            {/* container principal limitando a largura e dividindo em 4 colunas */}
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
                
                {/* coluna 1 - logo */}
                <div className="flex justify-center md:justify-start items-start">
                    <img 
                        src={undefined} 
                        alt="" 
                        className="w-[80px] h-auto opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* coluna 2 - endereço e contato */}
                <div>
                    <h4 className="text-white text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
                        (Nome)
                    </h4>
                    <p className="mb-2 leading-relaxed">
                        (Endereço)
                    </p>
                    <p>
                        Email: <a href="" className="hover:text-white transition-colors duration-300">exemplo@gmail.com</a>
                    </p>
                </div>

                {/* coluna 3 - redes sociais */}
                <div className="text-center md:text-left">
                    <h4 className="text-white text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
                        Redes Sociais (Em breve)
                    </h4>
                    <div className="flex justify-center md:justify-start">
                        <a href="#" className="text-[#a0a0a0] hover:text-white transition-colors duration-300" aria-label="YouTube">
                            {/* icone youtube */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* coluna 4 links */}
                <div>
                    <h4 className="text-white text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
                        Mais sobre nós
                    </h4>
                    <ul className="flex flex-col gap-3">
                        <li><a href="/institucional" className="hover:text-white transition-colors duration-300">Sobre</a></li>
                        <li><a href="/faleconosco" className="hover:text-white transition-colors duration-300">Contato</a></li>
                        <li><a href="/links-uteis" className="hover:text-white transition-colors duration-300">Links úteis</a></li>
                        <li><a href="/parceiros" className="hover:text-white transition-colors duration-300">Parceiros</a></li>
                        <li><a href="/termos" className="hover:text-white transition-colors duration-300">Privacidade</a></li>
                    </ul>
                </div>

            </div>

            {/* linha de Copyright */}
            <div className="max-w-[1200px] mx-auto mt-[80px] text-center text-[11px] text-[#666666]">
                <p>© Copyright | (exemplo) por <a href="#" className="hover:text-[#a0a0a0] transition-colors">(exemplo)</a> | Direitos Reservados</p>
            </div>
        </footer>
    );
};

export default Footer;