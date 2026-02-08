import { Router } from 'express';
import { searchController } from '../controllers/search.controllers';

const router = Router();

router.get('/health', (_, res) => {
  res.json({ status: 'OK' });
});

router.get('/', searchController);

export default router;
