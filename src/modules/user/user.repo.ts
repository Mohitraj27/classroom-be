import { db } from "@/config/db";
import { user } from "./user.model";
import { eq } from "drizzle-orm";
import { signupUserInput } from "./user.types";
export class UserRepository {
  async getAll() {
    return db.select().from(user);
  }

  async getById(id: number) {
    return db.select().from(user).where(eq(user.id, id));
  }

  async createuser(userData: signupUserInput) {
    return db.insert(user).values(userData);
  }
  
  async getByEmail(email: string) {
    return db.select().from(user).where(eq(user.email, email));
  }
  async delete(id: number) {
    return db.delete(user).where(eq(user.id, id));
  }
}
