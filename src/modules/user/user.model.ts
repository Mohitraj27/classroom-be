import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const user = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull(),
  
});
