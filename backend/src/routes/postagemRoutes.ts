import { Router } from 'express'; //gerenciador de rotas do express
import postagemController from '../controllers/postagemController';//importa as funções do controller
import verifyToken from '../helpers/verify-token';

const router = Router(); //inicializa o roteador do express

router.get('/', postagemController.listar); // rota pública para listar registros, com filtro opcional por categoria
router.post('/', verifyToken, postagemController.criar); // rota para cadastrar um novo registro (recebe JSON)
router.put('/:id', verifyToken, postagemController.atualizar); // rota protegida para atualizar um registro
router.delete('/:id', verifyToken, postagemController.excluir); // rota protegida para excluir um registro
router.get('/:slug', postagemController.buscarPorSlug); // rota pública para buscar um registro pelo slug
router.get('/categoria/:categoria', postagemController.buscarPorCategoriaPaginado); // rota pública para buscar registros paginados por categoria
router.get('/imagens/:id', postagemController.buscarImagem); // rota proxy para imagens do drive
router.get('/imagens/original/:id', postagemController.buscarImagemOriginal); // rota proxy para imagens originais do drive

export default router; // exporta o roteador para ser utilizado no server.ts
