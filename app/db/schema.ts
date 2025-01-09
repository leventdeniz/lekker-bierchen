import { mysqlTable, int, varchar, text, timestamp, decimal } from 'drizzle-orm/mysql-core';

export const beers = mysqlTable('beers', {
    id: int('id').primaryKey().autoincrement(),
    barcode: int('barcode'),
    name: varchar('name', { length: 255 }).notNull(),
    brewery: int('brewery').references(() => breweries.id),
    alcoholPercentage: decimal('alcohol_percentage', { precision: 4, scale: 1 }).notNull(),
    labelPhoto: varchar('label_photo', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const ratings = mysqlTable('ratings', {
    id: int('id').primaryKey().autoincrement(),
    beer: int('beer').references(() => beers.id).notNull(),
    sweetness: int('sweetness').notNull(),
    bitterness: int('bitterness').notNull(),
    sourness: int('sourness').notNull(),
    overallRating: int('overall_rating').notNull(),
    notes: text('notes'),
});

export const breweries = mysqlTable('breweries', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
