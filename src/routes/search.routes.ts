import { Router } from 'express';
import { searchController, reindexController } from '../controllers/search.controllers';

const router = Router();

router.get('/health', (_, res) => {
  res.json({ status: 'OK' });
});

router.post('/reindex', reindexController);

router.get('/', searchController);

export default router;
