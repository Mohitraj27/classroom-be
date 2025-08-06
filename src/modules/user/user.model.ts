import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";
import { nullable } from "zod";
import { UserRole } from "./user.types";

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
  role: varchar('role', { length: 20 }).notNull().default(UserRole.LEARNER),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const signupRequest = mysqlTable("signupRequest", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("firstName", { length: 40 }).notNull(),
  lastName: varchar("lastName", { length: 80 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  userName: varchar('userName', { length: 32 }).notNull().unique(),
  password: varchar("password", { length: 60 }).notNull(),
  contact_number: varchar('contact_number', { length: 10 }).notNull(),
  country: varchar('country', { length: 90 }).notNull(),
  city: varchar('city', { length: 35 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('PENDING'),
  rejectionReason: varchar('rejectionReason', { length: 180 }),  
  role: varchar('role', { length: 20 }).notNull().default(UserRole.LEARNER),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const  historySignupRequest = mysqlTable("historySignupRequest", {
    id: int("id").primaryKey().autoincrement(),
    firstName: varchar("firstName", { length: 40 }).notNull(),
    lastName: varchar("lastName", { length: 80 }),
    email: varchar("email", { length: 320 }).notNull().unique(),  
    userName: varchar('userName', { length: 32 }).notNull().unique(),
    password: varchar("password", { length: 60 }).notNull(),
    contact_number: varchar('contact_number', { length: 10 }).notNull(),
    country: varchar('country', { length: 90 }).notNull(),
    city: varchar('city', { length: 35 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('PENDING'),
    rejectionReason: varchar('rejectionReason', { length: 180 }),  
    role: varchar('role', { length: 20 }).notNull().default(UserRole.LEARNER),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  });
