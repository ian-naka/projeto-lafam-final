import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useNotificacao } from '../contextos/NotificacaoContexto';
import { fazerLogin } from '../servicos/autenticacao';
import { Button } from '../componentes/botao/Button';
import { Container } from '../componentes/container';
import { Input } from '../componentes/input/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { mostrarNotificacao } = useNotificacao();
  const { t } = useTranslation();

  const submeter = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setCarregando(true);
      const dados = await fazerLogin(email, senha);
      localStorage.setItem('token', dados.token);
      localStorage.setItem('adminId', String(dados.adminId || ''));
      mostrarNotificacao(t('common.success.login'), 'sucesso');
      const origem = sessionStorage.getItem('origem_pos_login');
      if (origem) {
        sessionStorage.removeItem('origem_pos_login');
      }
      await navigate({ to: origem || '/admin/nova-postagem' });
    } catch (error) {
      mostrarNotificacao(
        error instanceof Error ? error.message : t('common.errors.login'),
        'erro',
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container>
      <div className="flex w-full max-w-[305px] flex-col items-center gap-[18px] px-5 py-6">
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 className="lafam-text-display">{t('login.title')}</h1>
          <p className="lafam-text-subtitle">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={submeter} className="flex w-full flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="lafam-text-label">{t('login.emailLabel')}</span>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t('login.emailPlaceholder')}
              required
              className="h-11"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="lafam-text-label">{t('login.passwordLabel')}</span>
            <Input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              required
              className="h-11"
            />
          </label>

          <Button type="submit" className="mt-2 h-11 w-full" disabled={carregando} loading={carregando}>
            {t('login.submit')}
          </Button>

          <p className="lafam-text-helper text-center">
            {t('login.forgotPassword')}
            <Link to="/login" className="lafam-text-link">
              {t('login.forgotPasswordAction')}
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
};

export default Login;
