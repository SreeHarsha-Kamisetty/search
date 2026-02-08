import { Request, Response } from 'express';
import { searchProducts } from '../search/search.service';

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
