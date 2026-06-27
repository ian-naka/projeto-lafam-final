import { Router } from 'express';
import categoriaController from '../controllers/categoriaController';

const router = Router();

router.get('/', categoriaController.listar);

export default router;
