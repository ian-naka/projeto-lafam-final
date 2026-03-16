//rotas de autenticação

import { Router } from 'express'; //gerenciador de rotas do express
import postagemController from '../controllers/postagemController';//importa as funções do controller
import verifyToken from '../helpers/verify-token';
import upload from '../config/multer';

const router = Router(); //inicializa o roteador do express

router.post(
    '/', 
    verifyToken, 
    upload.fields([{ name: 'thumbFile', maxCount: 1 }, { name: 'galeriaFiles', maxCount: 10 }]),
    postagemController.criar
); // rota para cadastrar um novo registro

router.get('/:slug', postagemController.buscarPorSlug); // rota pública para buscar um registro pelo slug

export default router; // exporta o roteador para ser utilizado no server.ts