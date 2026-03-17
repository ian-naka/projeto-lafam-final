import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import CriarPostagem from './pages/Postagem/CriarPostagem';
import VisualizarPostagem from './pages/Postagem/VisualizarPostagem';
import Galeria from './pages/funcionalidades/Galeria';
import ExibirPostagemGaleria from './pages/funcionalidades/ExibirPostagemGaleria';

//componentes
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import FlashMessage from './components/FlashMessage';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <FlashMessage />
      {/* main flex-col e min-h-screen empurra o footer pro fundo se a página for curta */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/criar-registro" element={<CriarPostagem />} />
            <Route path="/acervo/:slug" element={<VisualizarPostagem />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/galeria/:category" element={<ExibirPostagemGaleria />} />
          </Routes>
        </main>
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;