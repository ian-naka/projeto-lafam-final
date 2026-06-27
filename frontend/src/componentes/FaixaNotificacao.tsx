import { useEffect } from 'react';
import { useNotificacao } from '../contextos/NotificacaoContexto';

const FaixaNotificacao = () => {
  const { notificacao, limparNotificacao } = useNotificacao();

  useEffect(() => {
    if (!notificacao) return;

    const timeout = window.setTimeout(() => {
      limparNotificacao();
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [notificacao, limparNotificacao]);

  if (!notificacao) return null;

  return (
    <div className={`faixa-notificacao ${notificacao.tipo}`}>
      {notificacao.mensagem}
    </div>
  );
};

export default FaixaNotificacao;
