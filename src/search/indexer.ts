import { db } from '../db';
import { products, searchIndex } from '../db/schema';
import { tokenize } from './tokenizer';
import { eq } from 'drizzle-orm';

const FIELD_WEIGHTS: Record<string, number> = {
  name: 3.0,
  brand: 2.0,
  category: 1.5,
  description: 1.0,
};

export const indexProduct = async (productId: number) => {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .then((rows) => rows[0]);

  if (!product) return;

  await db.delete(searchIndex).where(eq(searchIndex.productId, productId));

  const records: {
    token: string;
    productId: number;
    field: string;
    weight: string;
  }[] = [];

  for (const field of Object.keys(FIELD_WEIGHTS)) {
    const value = (product as any)[field];
    if (!value) continue;

    const tokens = tokenize(value);

    for (const token of tokens) {
      records.push({
        token,
        productId,
        field,
        weight: FIELD_WEIGHTS[field].toString(),
      });
    }
  }

  if (records.length > 0) {
    await db.insert(searchIndex).values(records);
  }
};
