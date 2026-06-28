import type { AuthResponse, LoginPayload } from '@lafam/back-front';
import { montarUrlApi } from './api';

export async function fazerLogin(email: string, senha: string): Promise<AuthResponse> {
  const payload: LoginPayload = { email, senha };

  const resposta = await fetch(montarUrlApi('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'Erro ao realizar login.');
  }

  return dados;
}
