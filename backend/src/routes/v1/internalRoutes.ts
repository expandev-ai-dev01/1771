import { Router } from 'express';
import productRoutes from './productRoutes';
import stockMovementRoutes from './stockMovementRoutes';

const router = Router();

// Feature-specific, authenticated routes will be added here.
router.use('/products', productRoutes);
router.use('/stock-movements', stockMovementRoutes);

export default router;
