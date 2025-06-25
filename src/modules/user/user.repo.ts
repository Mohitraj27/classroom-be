import { db } from "@/config/db";
import { user } from "./user.model";
import { eq } from "drizzle-orm";

export class UserRepository {
  async getAll() {
    return db.select().from(user);
  }

  async getById(id: number) {
    return db.select().from(user).where(eq(user.id, id));
  }

  async create(data: { name: string; email: string }) {
    return db.insert(user).values(data);
  }

  async delete(id: number) {
    return db.delete(user).where(eq(user.id, id));
  }
}
