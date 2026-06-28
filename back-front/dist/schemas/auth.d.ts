import { z } from 'zod';
export declare const registroAdminSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    senha: z.ZodString;
    confirmarSenha: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, z.core.$strip>;
export type RegistroAdminPayload = z.infer<typeof registroAdminSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type AuthResponse = {
    message: string;
    token: string;
    adminId: number;
};
