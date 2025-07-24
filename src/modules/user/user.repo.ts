import { db } from "@/config/db";
import { user } from "./user.model";
import { eq } from "drizzle-orm";
import { resetTokenType, signupUserInput,resetPasswordInput,UserRole } from "./user.types";
export class UserRepository {
  async getAll(page:number,limit:number) {
    return db.select().from(user).limit(limit).offset((page-1)*limit);
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
  async setresetToken(id: number, resetToken: resetTokenType) {
    return db.update(user).set( { resetToken: resetToken.resetToken, updatedAt: new Date() }).where(eq(user.id, id));
  }
  async updatePassword(id: number, hashedPassword: string) {
    return db.update(user).set({ password: hashedPassword, resetToken: null, updatedAt: new Date() }).where(eq(user.id, id));
  }
  async checkforResetToken(resetTokenData: resetPasswordInput) {
    return db.select({ id: user.id, email: user.email,resetToken: user.resetToken}).from(user).where(eq(user.resetToken, resetTokenData.resetToken));
  }

  async getUserName(userName: string) {
    return db.select().from(user).where(eq(user.userName, userName));
  }
  async showLearners(page:number,limit:number) {
    return db.select().from(user).where(eq(user.role, UserRole.LEARNER)).limit(limit).offset((page-1)*limit);
  }
  async showTutors(page:number,limit:number) {
    return db.select().from(user).where(eq(user.role, UserRole.TUTOR)).limit(limit).offset((page-1)*limit);
  }
}
