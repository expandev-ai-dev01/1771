import { Router } from 'express';
import * as productController from '@/api/v1/internal/product/productController';

const router = Router();

router.post('/', productController.createProduct);
router.get('/', productController.listProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);

export default router;
