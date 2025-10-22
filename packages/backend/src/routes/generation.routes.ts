import { Router } from 'express';
import * as generationController from '../controllers/generation.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router: Router = Router();

router.use(authenticate);

router.post('/', upload.single('image'), generationController.generate);
router.get('/', generationController.getGenerations);
router.get('/:id', generationController.getGeneration);
router.delete('/:id', generationController.deleteGeneration);

export default router;
