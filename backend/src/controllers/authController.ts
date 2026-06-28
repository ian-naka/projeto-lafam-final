//Controller de autenticação

import { Request, Response } from 'express'; //requisicao e resposta
import bcrypt from 'bcryptjs'; // criptografar
import jwt from 'jsonwebtoken'; //token para validar sessao
import { ZodError } from 'zod'; //biblioteca para criar regras de validacao
import { loginSchema, registroAdminSchema } from '@lafam/back-front';
import Admin from '../models/Admin';
import { encriptar, desencriptar } from '../helpers/criptoHelper'

//variavel de ambiente com afirmacao de tipo
const jwtSecret = process.env.JWT_SECRET as string;

if (!jwtSecret) {
    throw new Error("ERRO CRÍTICO: JWT_SECRET deve estar definido no .env");
}

export default class authController {

    // Cadastro do Admin
    static async registrar(req: Request, res: Response): Promise<void> {
        try {
            const { nome, email, senha } = registroAdminSchema.parse(req.body); // az as variaveis nome, email e senha receberem essas consts na resposta da requisicao

            //encripta o email para poder realizar a busca e o salvamento
            const emailEncriptado = encriptar(email);

            //verifica se o email já existe
            const adminExiste = await Admin.findOne({ where: { email: emailEncriptado } });
            if (adminExiste) {
                res.status(422).json({ message: 'Este e-mail já está em uso.' });
                return;
            }

            //criptografia da senha
            const salt = await bcrypt.genSalt(12);
            const senhaHash = await bcrypt.hash(senha, salt);

            //cria admin
            const novoAdmin = await Admin.create({
                nome,
                email: emailEncriptado,
                senha: senhaHash
            });

            //gera token usando o segredo validado
            const token = jwt.sign(
                { id: novoAdmin.id, nome: novoAdmin.nome },
                jwtSecret,
                { expiresIn: '1d' }
            );

            res.status(201).json({ 
                message: 'Administrador criado com sucesso!', 
                token,
                adminId: novoAdmin.id 
            });

        } catch (error: any) {
            console.error("ERRO NO CADASTRO:", error);
            if (error instanceof ZodError) {
                res.status(422).json({ 
                    message: "Dados inválidos", 
                    errors: error.issues.map((issue) => issue.message) 
                });
                return;
            }
            res.status(500).json({ message: 'Erro ao realizar cadastro.' });
        }
    }

    // Login de Admin
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha } = loginSchema.parse(req.body); //recebe email e senha via resposta da requisicao
            
            //encripta o email recebido para localizar no banco de dados
            const emailBusca = encriptar(email);
            const admin = await Admin.findOne({ where: { email: emailBusca } }); //localiza conta com esse email

            if (!admin) {
                res.status(422).json({ message: 'E-mail ou senha incorretos!' });
                return;
            } //se não encontrar, falha

            //comparacao da senha que foi mandada com a senha do sistema
            const senhaValida = await bcrypt.compare(senha, admin.senha);
            if (!senhaValida) {
                res.status(422).json({ message: 'E-mail ou senha incorretos!' });
                return;
            }

            //gera token
            const token = jwt.sign(
                { id: admin.id, nome: admin.nome },
                jwtSecret,
                { expiresIn: '1d' }
            );

            res.status(200).json({ 
                message: 'Login realizado com sucesso!', 
                token,
                adminId: admin.id 
            });

        } catch (error: any) {
            console.error("ERRO NO LOGIN:", error);
            if (error instanceof ZodError) {
                res.status(422).json({ 
                    message: "Dados inválidos", 
                    errors: error.issues.map((issue) => issue.message) 
                });
                return;
            }
            res.status(500).json({ message: 'Erro ao realizar login.' });
        }
    }

    // Verifica usuario atual
    static async checkAdmin(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ message: "Acesso negado!" });
                return;
            } //se nao possuir o authHeader, o acesso é negado
            
            const token = authHeader.split(' ')[1];
            
            const decoded = jwt.verify(token, jwtSecret) as unknown as { id: number };

            const admin = await Admin.findByPk(decoded.id, {
                attributes: { exclude: ['senha'] } //não retorna a senha
            });

            if (admin) {
                //desencripta o email antes de enviar a resposta para o frontend
                admin.email = desencriptar(admin.email);
            }

            res.status(200).json(admin);

        } catch (error) {
            res.status(401).json({ message: "Token inválido!" });
        }
    }
}
