import { mysqlTable, int, varchar, text, timestamp, decimal, bigint } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// === === Drinks === ===
export const drinks = mysqlTable('drinks', {
    id: int('id').primaryKey().autoincrement(),
    barcode: bigint({ mode: 'number', unsigned: true }),
    name: varchar('name', { length: 255 }).notNull(),
    brewery: int('brewery').references(() => breweries.id),
    alcoholPercentage: decimal('alcohol_percentage', { precision: 4, scale: 1 }),
    labelPhoto: varchar('label_photo', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const drinksRelations = relations(drinks, ({ one, many }) => ({
  brewery: one(breweries, {
    fields: [drinks.brewery],
    references: [breweries.id]
  }),
  ratings: many(ratings),
  drinking_logs: many(drinking_logs)
}));

export type DrinkType = typeof drinks.$inferSelect;
export type NewDrinkType = typeof drinks.$inferInsert;

// === === Ratings === ===
export const ratings = mysqlTable('ratings', {
    id: int('id').primaryKey().autoincrement(),
    drink: int('beer').references(() => drinks.id).notNull(),
    sweetness: int('sweetness').notNull(),
    bitterness: int('bitterness').notNull(),
    sourness: int('sourness').notNull(),
    overallRating: int('overall_rating').notNull(),
    notes: text('notes'),
});

export const ratingsRelations = relations(ratings, ({ one, many }) => ({
  drink: one(drinks, {
    fields: [ratings.drink],
    references: [drinks.id]
  }),
  drinking_logs: many(drinking_logs)
}));

export type RatingType = typeof ratings.$inferSelect;
export type NewRatingType = typeof ratings.$inferInsert;

// === === Breweries === ===
export const breweries = mysqlTable('breweries', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export const breweriesRelations = relations(breweries, ({ many }) => ({
  drinks: many(drinks)
}));

export type BreweryType = typeof breweries.$inferSelect;
export type NewBreweryType = typeof breweries.$inferInsert;

// === === Drinking Logs === ===
export const drinking_logs = mysqlTable('drinking_logs', {
  id: int('id').primaryKey().autoincrement(),
  drink: int('drink').references(() => drinks.id).notNull(),
  rating: int('rating').references(() => ratings.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const drinkingLogsRelations = relations(drinking_logs, ({ one }) => ({
  drink: one(drinks, {
    fields: [drinking_logs.drink],
    references: [drinks.id],
  }),
  rating: one(ratings, {
    fields: [drinking_logs.rating],
    references: [ratings.id],
  }),
}));

export type DrinkingLogType = typeof drinking_logs.$inferSelect;
export type NewDrinkingLogType = typeof drinking_logs.$inferInsert;
