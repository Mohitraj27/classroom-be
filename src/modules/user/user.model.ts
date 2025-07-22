import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";
import { nullable } from "zod";

export const user = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("firstName", { length: 40 }).notNull(),
  lastName: varchar("lastName", { length: 80 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  userName: varchar('userName', { length: 32 }).notNull().unique(),
  password: varchar("password", { length: 60 }).notNull(),
  contact_number: varchar('contact_number', { length: 10 }).notNull(),
  country: varchar('country', { length: 90 }).notNull(),
  city: varchar('city', { length: 35 }).notNull(),
  resetToken: varchar('resetToken', { length: 64 }),
  role: varchar('role', { length: 20 }).notNull().default('learner'),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});
