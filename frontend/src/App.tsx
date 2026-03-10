import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login'

//componentes
import Footer from './components/Footer';
import Navbar from './components/Navbar';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* main flex-col e min-h-screen empurra o footer pro fundo se a página for curta */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;