import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type TipoNotificacao = 'sucesso' | 'erro';

interface EstadoNotificacao {
  mensagem: string;
  tipo: TipoNotificacao;
}

interface NotificacaoContextoProps {
  notificacao: EstadoNotificacao | null;
  mostrarNotificacao: (mensagem: string, tipo: TipoNotificacao) => void;
  limparNotificacao: () => void;
}

const NotificacaoContexto = createContext<NotificacaoContextoProps | null>(null);

export const ProvedorNotificacao = ({ children }: { children: ReactNode }) => {
  const [notificacao, setNotificacao] = useState<EstadoNotificacao | null>(null);

  const valor = useMemo<NotificacaoContextoProps>(() => ({
    notificacao,
    mostrarNotificacao: (mensagem, tipo) => setNotificacao({ mensagem, tipo }),
    limparNotificacao: () => setNotificacao(null),
  }), [notificacao]);

  return (
    <NotificacaoContexto.Provider value={valor}>
      {children}
    </NotificacaoContexto.Provider>
  );
};

export function useNotificacao() {
  const contexto = useContext(NotificacaoContexto);

  if (!contexto) {
    throw new Error('useNotificacao deve ser usado dentro de ProvedorNotificacao.');
  }

  return contexto;
}
