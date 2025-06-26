import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const user = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contact_number: varchar('contact_number', { length: 10 }),
});
