//rotas de autenticação

import { Router } from 'express'; //gerenciador de rotas do express
import postagemController from '../controllers/postagemController';//importa as funções do controller
import verifyToken from '../helpers/verify-token'

const router = Router(); //inicializa o roteador do express

router.post('/criar-registro', verifyToken, postagemController.criar); //rota para cadastrar um novo administrador

export default router; // exporta o roteador para ser utilizado no server.ts