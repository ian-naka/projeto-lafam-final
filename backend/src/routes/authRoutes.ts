// Rotas de autenticação

import { Router } from 'express'; //gerenciador de rotas do express
import authController from '../controllers/authController'; //importa as funções do controller

const router = Router(); //inicializa o roteador do express

router.post('/registrar', authController.registrar); //rota para cadastrar um novo administrador
router.post('/login', authController.login); //rota para realizar o login do administrador
router.get('/checkadmin', authController.checkAdmin); //rota para verificar o administrador logado através do token

export default router; // exporta o roteador para ser utilizado no server.ts