import { db } from '../db';
import { searchIndex, products } from '../db/schema';
import { tokenize } from './tokenizer';
import { sql } from 'drizzle-orm';

export const searchProducts = async (query: string, limit = 10, offset = 0) => {
  const tokens = tokenize(query);
  console.log(tokens);
  if (tokens.length === 0) return [];

  const tokenFragments = tokens.map((t) => sql`${t}`);
  console.log(tokenFragments);
  const scoredResult = await db.execute<{
    productId: number;
    score: string;
  }>(sql`
    SELECT
      ${searchIndex.productId} AS "productId",
      SUM(${searchIndex.weight}) AS score
    FROM ${searchIndex}
    WHERE ${searchIndex.token} IN (${sql.join(tokenFragments, sql.raw(', '))})
    GROUP BY ${searchIndex.productId}
    ORDER BY score DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `);
  console.log(scoredResult);
  type ScoredRow = { productId: number; score: string };
  const scored: ScoredRow[] =
    (scoredResult as unknown as { rows: ScoredRow[] }).rows ?? [];
  if (scored.length === 0) return [];

  const ids = scored.map((r) => r.productId);
  const idFragments = ids.map((id) => sql`${id}`);

  const rowsResult = await db.execute(sql`
    SELECT *
    FROM ${products}
    WHERE ${products.id} IN (${sql.join(idFragments, sql.raw(', '))})
  `);

  type ProductRow = { id: number; [key: string]: unknown };
  const rows: ProductRow[] =
    (rowsResult as unknown as { rows: ProductRow[] }).rows ?? [];
  const productMap = new Map(rows.map((p) => [p.id, p]));

  return scored.map((r) => {
    const product = productMap.get(r.productId);
    return product ? { ...product, score: r.score } : { score: r.score };
  });
};
