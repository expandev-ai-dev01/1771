import { Router } from 'express';
import * as stockMovementController from '@/api/v1/internal/stock-movement/stockMovementController';

const router = Router();

router.post('/', stockMovementController.createStockMovement);
router.get('/', stockMovementController.listStockMovements);

export default router;
