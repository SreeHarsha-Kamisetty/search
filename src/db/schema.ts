import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  timestamp,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  brand: text('brand'),
  category: text('category'),
  price: numeric('price', { precision: 10, scale: 2 }),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('0'),
  popularityScore: integer('popularity_score').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const searchIndex = pgTable(
  'search_index',
  {
    token: text('token').notNull(),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    field: text('field').notNull(),
    weight: numeric('weight', { precision: 3, scale: 2 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.token, table.productId, table.field],
    }),
    tokenIdx: index('idx_search_token').on(table.token),
    productIdx: index('idx_search_product').on(table.productId),
  }),
);
