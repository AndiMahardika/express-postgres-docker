import { Router } from 'express';
import * as suratController from '../controllers/suratPilihanController';
import { authMiddleware, isAdmin } from '../middleware/auth';

const suratPilihanRoutes = Router();

suratPilihanRoutes.post('/', authMiddleware, isAdmin, suratController.create);
suratPilihanRoutes.get('/', authMiddleware, isAdmin, suratController.getAll);
suratPilihanRoutes.put('/:id', authMiddleware, isAdmin, suratController.update);
suratPilihanRoutes.delete('/:id', authMiddleware, isAdmin, suratController.deleteSuratPilihan);

export default suratPilihanRoutes;
