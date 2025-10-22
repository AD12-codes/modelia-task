import { Router } from 'express';
import authRoutes from './auth.routes';
import generationRoutes from './generation.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/generations', generationRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
