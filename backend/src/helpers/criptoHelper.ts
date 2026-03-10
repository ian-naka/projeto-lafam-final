// Helper para criptografia de dados sensíveis

import crypto from 'crypto'; //biblioteca nativa para criptografia de dados

//variaveis de ambiente com afirmacao de tipo
const encryptionKey = process.env.EMAIL_ENCRYPTION_KEY as string;

if (!encryptionKey || encryptionKey.length !== 32) {
    throw new Error("ERRO CRÍTICO: EMAIL_ENCRYPTION_KEY deve ter 32 caracteres no .env");
}

//criptografia para o email
const ALGORITMO = 'aes-256-cbc';
const CHAVE = Buffer.from(encryptionKey);
const IV = Buffer.from('lafam_projeto_uf'); //IV fixo para permitir busca por e-mail no banco

//encripta dados
export const encriptar = (texto: string): string => {
    const cipher = crypto.createCipheriv(ALGORITMO, CHAVE, IV);
    let encrypted = cipher.update(texto, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

//desencripta dados
export const desencriptar = (textoEncriptado: string): string => {
    const decipher = crypto.createDecipheriv(ALGORITMO, CHAVE, IV);
    let decrypted = decipher.update(textoEncriptado, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};