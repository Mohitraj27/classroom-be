import { mysqlTable, int, text, timestamp } from 'drizzle-orm/mysql-core';
import { user } from '../user/user.model';

export const feedback = mysqlTable('feedback', {
  id: int('id').primaryKey().autoincrement(),
  giverId: int('giverId').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  receiverId: int('receiverId').notNull().references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  feedbackText: text('feedbackText').notNull(),
  rating: int('rating').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
