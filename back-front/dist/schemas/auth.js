"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registroAdminSchema = void 0;
const zod_1 = require("zod");
exports.registroAdminSchema = zod_1.z
    .object({
    nome: zod_1.z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    email: zod_1.z.string().email('Insira um e-mail válido.'),
    senha: zod_1.z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmarSenha: zod_1.z.string(),
})
    .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Insira um e-mail válido.'),
    senha: zod_1.z.string().min(1, 'A senha é obrigatória.'),
});
