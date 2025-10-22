import { Router } from 'express';
import authRoutes from './auth.routes';

const router: Router = Router();

router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
