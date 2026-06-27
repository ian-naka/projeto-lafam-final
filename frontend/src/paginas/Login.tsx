import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useNotificacao } from '../contextos/NotificacaoContexto';
import { fazerLogin } from '../servicos/autenticacao';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { mostrarNotificacao } = useNotificacao();

  const submeter = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setCarregando(true);
      const dados = await fazerLogin(email, senha);
      localStorage.setItem('token', dados.token);
      localStorage.setItem('adminId', String(dados.adminId || ''));
      mostrarNotificacao('Login realizado com sucesso.', 'sucesso');
      const origem = sessionStorage.getItem('origem_pos_login');
      if (origem) {
        sessionStorage.removeItem('origem_pos_login');
      }
      await navigate({ to: origem || '/admin/nova-postagem' });
    } catch (error) {
      mostrarNotificacao(error instanceof Error ? error.message : 'Erro ao realizar login.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="pagina pagina--estreita">
      <div className="painel">
        <h1>Login</h1>
        <form onSubmit={submeter} className="formulario">
          <label className="bloco-campo">
            <span className="bloco-campo__rotulo">E-mail</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label className="bloco-campo">
            <span className="bloco-campo__rotulo">Senha</span>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" required />
          </label>

          <button type="submit" className="botao botao--primario" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
