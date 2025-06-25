import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const user = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("firstName", { length: 256 }),
  lastName: varchar("lastName", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  contact_number: varchar('contact_number', { length: 10 }),
});
