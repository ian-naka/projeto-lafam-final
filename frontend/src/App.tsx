import { Outlet } from '@tanstack/react-router';
import Rodape from './componentes/Rodape';
import { ProvedorNotificacao } from './contextos/NotificacaoContexto';
import FaixaNotificacao from './componentes/FaixaNotificacao';
import SidebarInicio from './componentes/sidebar/SidebarInicio';

function App() {
  return (
    <ProvedorNotificacao>
      <div className="app-shell">
        <SidebarInicio />
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
