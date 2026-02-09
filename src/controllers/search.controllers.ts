import { Request, Response } from 'express';
import { searchProducts } from '../search/search.service';
import { reindexAllProducts } from '../search/reIndex';

export const reindexController = async (_req: Request, res: Response) => {
  try {
    const count = await reindexAllProducts();
    return res.json({ success: true, reindexed: count });
  } catch (err) {
    console.error('Reindex error:', err);
    return res.status(500).json({ success: false, error: 'Reindex failed' });
  }
};

export const searchController = async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);

  console.log(q, limit, offset);
  if (!q) {
    return res.json([]);
  }

  const results = await searchProducts(q, limit, offset);
  res.json(results);
};
