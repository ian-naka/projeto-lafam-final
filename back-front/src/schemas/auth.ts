import { z } from 'zod';

export const registroAdminSchema = z
  .object({
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    email: z.string().email('Insira um e-mail válido.'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  });

export const loginSchema = z.object({
  email: z.string().email('Insira um e-mail válido.'),
  senha: z.string().min(1, 'A senha é obrigatória.'),
});

export type RegistroAdminPayload = z.infer<typeof registroAdminSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;

export type AuthResponse = {
  message: string;
  token: string;
  adminId: number;
};
