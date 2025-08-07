import { db } from "@/config/db";
import { user, signupRequest, historySignupRequest } from "./user.model";
import { eq } from "drizzle-orm";
import { resetTokenType, signupUserInput,resetPasswordInput,UserRole,signupRequestStatus, rejectionSignupRequestInput } from "./user.types";
export class UserRepository {
  async getAll(page:number,limit:number) {
    return db.select().from(user).limit(limit).offset((page-1)*limit);
  }

  async getById(id: number) {
    return db.select().from(user).where(eq(user.id, id));
  }

  async createuser(userData: signupUserInput) {
    return db.insert(signupRequest).values(userData);
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
  async showRequests(page:number,limit:number) {
    return db.select().from(signupRequest).limit(limit).offset((page-1)*limit);
  }
  async getSignupRequestById(id: number) {
    return db.select().from(signupRequest).where(eq(signupRequest.id, id));
  }
  async rejectRequest(rejectsignupData: rejectionSignupRequestInput) {
    return db.update(signupRequest).set({ status: signupRequestStatus.REJECTED, rejectionReason:rejectsignupData.rejectionReason, updatedAt: new Date() }).where(eq(signupRequest.id, rejectsignupData.id));
  }
  async insertUser(signupData: signupUserInput) {
    return db.insert(user).values(signupData);
  }
  async approveRequest(signupData: signupUserInput) {
    return db.insert(signupRequest).values(signupData);
  }
  async deleteSignupRequest(id:number){
    return db.delete(signupRequest).where(eq(signupRequest.id, id));
  }
  async moveToHistory(data: any) {
    return db.insert(historySignupRequest).values(data);
  }
  async updateProfile(id:number, userData: Partial<signupUserInput>) {
    return db.update(user).set({ ...userData, updatedAt: new Date() }).where(eq(user.id, id));
  }
}
