import { montarUrlApi } from './api';

export async function fazerLogin(email: string, senha: string) {
  const resposta = await fetch(montarUrlApi('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'Erro ao realizar login.');
  }

  return dados;
}
