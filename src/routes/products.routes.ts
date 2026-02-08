import { Router } from 'express';
import {
  uploadProductsController,
  getProductsController,
} from '../controllers/products.controllers';

const router = Router();

router.post('/', uploadProductsController);
router.get('/', getProductsController);

export default router;
