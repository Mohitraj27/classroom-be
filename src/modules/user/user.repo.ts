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

  async createuser(userData: { firstName: string; lastName:string; email: string; password: string; contact_number: string }) {
    const result = await db.insert(user).values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        contact_number: userData.contact_number
    });
    const insertedId = result[0].insertId;
    return {
        id: insertedId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        contact_number: userData.contact_number
    };
  }
  async getByEmail(email: string) {
    return db.select().from(user).where(eq(user.email, email));
  }
  async delete(id: number) {
    return db.delete(user).where(eq(user.id, id));
  }
}
