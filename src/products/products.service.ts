import { db } from '../db';
import { products } from '../db/schema';
import { indexProduct } from '../search/indexer';
import { and, eq, inArray, sql, type SQL } from 'drizzle-orm';

export type ProductInsert = {
  name: string;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  price?: string | null;
  rating?: string | null;
  popularityScore?: number | null;
};

export type GetProductsFilters = {
  productIds?: number[];
  brand?: string;
};

export type GetProductsOptions = GetProductsFilters & {
  limit?: number;
  offset?: number;
};

export const createProducts = async (items: ProductInsert[]) => {
  if (items.length === 0) return { inserted: 0, ids: [] as number[] };

  const values = items.map((item) => ({
    name: item.name,
    description: item.description ?? null,
    brand: item.brand ?? null,
    category: item.category ?? null,
    price: item.price ?? null,
    rating: item.rating ?? null,
    popularityScore: item.popularityScore ?? 0,
  }));

  const inserted = await db
    .insert(products)
    .values(values)
    .returning({ id: products.id });

  const ids = inserted.map((r) => r.id);

  for (const id of ids) {
    await indexProduct(id);
  }

  return { inserted: ids.length, ids };
};

export const getProducts = async (options: GetProductsOptions) => {
  const limit = Math.min(Math.max(1, options.limit ?? 10), 100);
  const offset = Math.max(0, options.offset ?? 0);

  const conditions: SQL[] = [];
  if (options.productIds?.length) {
    conditions.push(inArray(products.id, options.productIds));
  }
  if (options.brand != null && options.brand !== '') {
    conditions.push(eq(products.brand, options.brand));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(products)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(products.id),
    whereClause
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(products)
          .where(whereClause)
      : db.select({ count: sql<number>`count(*)::int` }).from(products),
  ]);

  const total = countResult[0]?.count ?? 0;

  return {
    data: rows,
    pagination: {
      limit,
      offset,
      total,
    },
  };
};
