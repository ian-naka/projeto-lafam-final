import { Outlet } from '@tanstack/react-router';
import Cabecalho from './componentes/Cabecalho';
import Rodape from './componentes/Rodape';
import { ProvedorNotificacao } from './contextos/NotificacaoContexto';
import FaixaNotificacao from './componentes/FaixaNotificacao';

function App() {
  return (
    <ProvedorNotificacao>
      <div className="app-shell">
        <Cabecalho />
        <FaixaNotificacao />
        <main className="conteudo-principal">
          <Outlet />
        </main>
        <Rodape />
      </div>
    </ProvedorNotificacao>
  );
}

export default App;
