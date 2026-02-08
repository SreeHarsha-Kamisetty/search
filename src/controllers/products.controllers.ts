import { Request, Response } from 'express';
import {
  createProducts,
  getProducts,
  type ProductInsert,
} from '../products/products.service';

export const uploadProductsController = async (req: Request, res: Response) => {
  const body = req.body;

  if (!Array.isArray(body)) {
    return res.status(400).json({
      error: 'Body must be an array of product objects',
    });
  }

  const items: ProductInsert[] = [];
  for (let i = 0; i < body.length; i++) {
    const item = body[i];
    if (item == null || typeof item !== 'object' || typeof item.name !== 'string') {
      return res.status(400).json({
        error: `Item at index ${i}: must be an object with a string "name" property`,
      });
    }
    items.push({
      name: item.name,
      description: item.description ?? null,
      brand: item.brand ?? null,
      category: item.category ?? null,
      price: item.price != null ? String(item.price) : null,
      rating: item.rating != null ? String(item.rating) : null,
      popularityScore:
        typeof item.popularityScore === 'number' ? item.popularityScore : null,
    });
  }

  try {
    const result = await createProducts(items);
    return res.status(201).json(result);
  } catch (err) {
    console.error('Upload products error:', err);
    return res.status(500).json({ error: 'Failed to create products' });
  }
};

export const getProductsController = async (req: Request, res: Response) => {
  const limit = Math.min(
    100,
    Math.max(1, Number(req.query.limit) || 10)
  );
  const offset = Math.max(0, Number(req.query.offset) || 0);

  let productIds: number[] | undefined;
  const productIdParam = req.query.productId ?? req.query.productIds;
  if (productIdParam != null) {
    const raw = Array.isArray(productIdParam)
      ? productIdParam
      : String(productIdParam).split(',');
    const parsed = raw
      .map((s) => Number(String(s).trim()))
      .filter((n) => !Number.isNaN(n));
    if (parsed.length > 0) productIds = parsed;
  }

  const brand =
    req.query.brand != null && req.query.brand !== ''
      ? String(req.query.brand).trim()
      : undefined;

  try {
    const result = await getProducts({
      limit,
      offset,
      productIds,
      brand,
    });
    return res.json(result);
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};
