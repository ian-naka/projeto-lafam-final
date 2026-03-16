import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // esconder botão no criar registro
  const esconderBotao = location.pathname === '/criar-registro';

  // botão preto nas rotas de acervo
  const corBotao = location.pathname.startsWith('/acervo/') ? 'bg-black' : 'bg-white';

  return (
    <>
      {/* cabecalho transparente */}
      <header className="absolute top-0 w-full z-[100] px-12 py-6 flex justify-between items-center bg-transparent pointer-events-none">
        <img
          src="https://lafam.bio.br/wp-content/uploads/2023/03/Logo_circulo_cor.png"
          alt="LAFAM"
          className="h-[80px] w-auto pointer-events-auto"
        />

        {/* botao menu */}
        {!esconderBotao && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col gap-[6px] p-2 focus:outline-none pointer-events-auto"
          >
            <span className={`block w-[32px] h-[2px] ${corBotao} transition-colors`}></span>
            <span className={`block w-[32px] h-[2px] ${corBotao} transition-colors`}></span>
            <span className={`block w-[32px] h-[2px] ${corBotao} transition-colors`}></span>
          </button>
        )}
      </header>

      {/* menu fullscrean e comportamento */}
      <div
        className={`fixed inset-0 z-[999] bg-white flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        {/* botao fechar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-10 right-12 text-black text-[40px] font-thin leading-none transition-colors border-none bg-transparent"
        >
          ✕
        </button>

        {/* itens de menu */}
        <nav className="flex flex-col items-center gap-6 text-center font-['Heebo','Roboto',sans-serif]">
          <a href="/galeria" className="text-black text-[22px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            GALERIA
          </a>
          <a href="/busca-acervo" className="text-black text-[22px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            BUSCA AO ACERVO
          </a>
          <a href="/equipe" className="text-black text-[22px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            EQUIPE
          </a>
          <a href="/cadastro" className="text-black text-[22px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            CADASTRO
          </a>
          <a href="/submissao" className="text-black text-[22px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
            SUBMISSÃO
          </a>
          <a href="/catalogo" className="text-black text-[22px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg>
            CATÁLOGO
          </a>
          <a href="/login" className="text-black text-[22px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            LOGIN
          </a>
        </nav>
      </div>
    </>
  );
};

export default Navbar;