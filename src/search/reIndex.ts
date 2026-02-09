import { db } from '../db';
import { products } from '../db/schema';
import { indexProduct } from './indexer';

export const reindexAllProducts = async (): Promise<number> => {
  const allProducts = await db.select().from(products);

  for (const product of allProducts) {
    await indexProduct(product.id);
  }

  return allProducts.length;
};
