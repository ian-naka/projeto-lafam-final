import React from 'react';

// --- Sub-componente de Seção (para manter o padrão do LAFAM) ---
const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <section className={`py-16 px-6 md:px-20 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white">
      
      {/* 1. NAVBAR (Baseada no Flyout Menu do Avada) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <img src="https://lafam.bio.br/wp-content/uploads/2023/03/Logo_circulo_cor-298x300.png" alt="LAFAM" className="h-12 w-auto" />
        <ul className="hidden md:flex gap-8 font-medium text-green-900">
          <li className="hover:text-green-600 cursor-pointer">Galeria</li>
          <li className="hover:text-green-600 cursor-pointer">Busca</li>
          <li className="hover:text-green-600 cursor-pointer">Equipe</li>
          <li className="hover:text-green-600 cursor-pointer font-bold border-2 border-green-600 px-4 py-1 rounded-full">Login</li>
        </ul>
      </nav>

      {/* 2. HERO SECTION (Substituindo o RevSlider) */}
      <header className="relative h-[80vh] flex items-center justify-center bg-black overflow-hidden pt-20">
        <img 
          src="https://lafam.bio.br/wp-content/uploads/2024/12/Slide02.jpg" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Natureza"
        />
        <div className="relative text-center text-white z-10 px-4">
          <h1 className="text-6xl md:text-8xl font-serif mb-4 tracking-tighter">LAFAM</h1>
          <p className="text-sm md:text-lg font-bold tracking-[0.3em] uppercase mb-8">
            Laboratório de Fotografia Ambiental
          </p>
          <button className="bg-white text-black px-10 py-3 font-bold hover:bg-green-600 hover:text-white transition-all uppercase tracking-widest">
            Galeria
          </button>
        </div>
      </header>

      {/* 3. SOBRE O LAFAM (Grid 2 colunas) */}
      <Section className="bg-gray-50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-br-[100px] overflow-hidden shadow-2xl">
            <img src="https://lafam.bio.br/wp-content/uploads/2024/12/CapaLafamDezembro.jpg" alt="Capa" />
          </div>
          <div>
            <span className="text-green-700 font-bold uppercase tracking-widest text-sm">Sobre o Lafam</span>
            <h2 className="text-4xl font-bold mt-2 mb-6">Laboratório de Fotografia Ambiental</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              O Lafam é uma iniciativa inovadora com o objetivo de integrar registros fotográficos realizados por fotógrafos amadores e profissionais, em um ambiente de pesquisa colaborativa e comunicação participativa.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-green-700 text-white px-6 py-2 rounded shadow hover:bg-green-800">Consulte o acervo</button>
              <button className="border border-green-700 text-green-700 px-6 py-2 rounded hover:bg-green-50">Normas e Orientações</button>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. NÚMEROS (Stats) */}
      <Section className="bg-white text-center border-y border-gray-100">
        <h3 className="text-3xl font-bold mb-12">Lafam em números</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border-b-4 border-green-200">
            <p className="text-5xl font-bold text-green-700">04</p>
            <p className="text-gray-500 uppercase tracking-widest mt-2">Colaboradores</p>
          </div>
          <div className="p-6 border-b-4 border-green-200">
            <p className="text-5xl font-bold text-green-700">05</p>
            <p className="text-gray-500 uppercase tracking-widest mt-2">Localidades</p>
          </div>
          <div className="p-6 border-b-4 border-green-200">
            <p className="text-5xl font-bold text-green-700">950</p>
            <p className="text-gray-500 uppercase tracking-widest mt-2">Registros</p>
          </div>
        </div>
      </Section>

      {/* 5. CITAÇÃO (Onde tem o Goethe) */}
      <section className="relative py-24 bg-fixed bg-cover bg-center text-white text-center" style={{backgroundImage: "url('https://lafam.bio.br/wp-content/uploads/2019/03/testimonial-bg.jpg')"}}>
        <div className="absolute inset-0 bg-green-900/40"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
           <p className="text-3xl italic font-serif">“A natureza é o único livro que oferece conteúdo valioso em todas as suas folhas.”</p>
           <p className="mt-6 font-bold uppercase tracking-widest text-green-200">Johann Wolfgang von Goethe</p>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-green-950 text-white py-16 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="flex justify-center md:justify-start">
            <img src="https://lafam.bio.br/wp-content/uploads/2023/03/Logo_circulo_cor.png" className="h-20 w-auto" alt="Logo Footer" />
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">Contato</h4>
            <p className="text-sm text-green-100/70">R. Visc. de Mauá, 300<br/>Juiz de Fora – MG<br/>contato@lafam.bio.br</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">Links</h4>
            <ul className="text-sm text-green-100/70 space-y-2">
              <li className="hover:text-white cursor-pointer">Sobre</li>
              <li className="hover:text-white cursor-pointer">Privacidade</li>
              <li className="hover:text-white cursor-pointer">Parceiros</li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-green-100/50">© 2026 | LAFAM UFJF<br/>Direitos Reservados</p>
          </div>
        </div>
      </footer>

    </div>
  );
}