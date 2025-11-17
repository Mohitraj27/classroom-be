import { db } from "@/config/db";
import { user, signupRequest, historySignupRequest } from "./user.model";
import { and, eq, isNotNull } from "drizzle-orm";
import { resetTokenType, signupUserInput,resetPasswordInput,UserRole,signupRequestStatus, rejectionSignupRequestInput,answerQuizInput } from "./user.types";
import {learnerAssignment,quizSubmission,quizAnswer } from '@/modules/learning-content/learning-content.model';
export class UserRepository {
  async getAll(page: number, limit: number, trx: any) {
    return trx.select().from(user).limit(limit).offset((page - 1) * limit);
  }

  async getById(id: number, trx: any) {
    return trx.select().from(user).where(eq(user.id, id));
  }

  async createSignupRequest(payload: signupUserInput, trx: any) {
    return trx.insert(signupRequest).values(payload);
  }

  async getByEmail(email: string, trx: any) {
    return trx.select().from(user).where(eq(user.email, email));
  }

  async deleteUser(id: number, trx: any) {
    return trx.delete(user).where(eq(user.id, id));
  }

  async setResetToken(id: number, resetToken: resetTokenType, trx: any) {
    return trx.update(user)
      .set({ resetToken: resetToken.resetToken, updatedAt: new Date() })
      .where(eq(user.id, id));
  }

  async updatePassword(id: number, hashedPassword: string, trx: any) {
    return trx.update(user)
      .set({ password: hashedPassword, resetToken: null, updatedAt: new Date() })
      .where(eq(user.id, id));
  }

  async checkForResetToken(payload: resetPasswordInput, trx: any) {
    return trx
      .select({ id: user.id, email: user.email, resetToken: user.resetToken })
      .from(user)
      .where(eq(user.resetToken, payload.resetToken));
  }

  async getUserName(userName: string, trx: any) {
    return trx.select().from(user).where(eq(user.userName, userName));
  }

  async showLearners(page: number, limit: number, trx: any) {
    return trx.select().from(user).where(eq(user.role, UserRole.LEARNER)).limit(limit).offset((page - 1) * limit);
  }

  async showTutors(page: number, limit: number, trx: any) {
    return trx.select().from(user).where(eq(user.role, UserRole.TUTOR)).limit(limit).offset((page - 1) * limit);
  }

  async showRequests(page: number, limit: number, trx: any) {
    return trx.select().from(signupRequest).limit(limit).offset((page - 1) * limit);
  }

  async getSignupRequestById(id: number, trx: any) {
    return trx.select().from(signupRequest).where(eq(signupRequest.id, id));
  }

  async rejectSignupRequest(rejectsignupData: rejectionSignupRequestInput, trx: any) {
    return trx.update(signupRequest).set({
      status: signupRequestStatus.REJECTED,
      rejectionReason: rejectsignupData.rejectionReason,
      updatedAt: new Date()
    }).where(eq(signupRequest.id, rejectsignupData.id));
  }

  async insertUser(userPayload: signupUserInput, trx: any) {
    return trx.insert(user).values(userPayload);
  }

  async insertSignupRequest(signupData: signupUserInput, trx: any) {
    return trx.insert(signupRequest).values(signupData);
  }

  async deleteSignupRequest(id: number, trx: any) {
    return trx.delete(signupRequest).where(eq(signupRequest.id, id));
  }

  async moveToHistory(data: any, trx: any) {
    return trx.insert(historySignupRequest).values(data);
  }

  async updateProfile(id: number, userData: Partial<signupUserInput>, trx: any) {
    return trx.update(user).set({ ...userData, updatedAt: new Date() }).where(eq(user.id, id));
  }

  async exportUserToCSV(trx: any) {
    return trx.select().from(user);
  }

  async getAllAssignedQuizzes(userId: number, trx: any) {
    return trx.select().from(learnerAssignment).where(and(eq(learnerAssignment.learnerId, userId), isNotNull(learnerAssignment.quizId)));
  }

  async getAllAssignedContents(userId: number, trx: any) {
    return trx.select().from(learnerAssignment).where(and(eq(learnerAssignment.learnerId, userId), isNotNull(learnerAssignment.contentId)));
  }

  async getAssignedQuiz(userId: number, quizId: number, trx: any) {
    return trx.select().from(learnerAssignment).where(and(eq(learnerAssignment.learnerId, userId), eq(learnerAssignment.quizId, quizId)));
  }

  async getAssignedContent(userId: number, contentId: number, trx: any) {
    return trx.select().from(learnerAssignment).where(and(eq(learnerAssignment.learnerId, userId), eq(learnerAssignment.contentId, contentId)));
  }

  async answerQuiz(input: answerQuizInput, trx: any) {
    const [submission] = await trx.insert(quizSubmission).values({
      quizId: input.quizId,
      learnerId: input.learnerId,
      submittedAt: new Date()
    }).$returningId();

    const answerRows = (input.answers || []).map((a: any) => ({
      submissionId: submission.id,
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      isCorrect: a.isCorrect ?? false,
      marksObtained: a.marksObtained ?? 0
    }));

    if (answerRows.length) {
      await trx.insert(quizAnswer).values(answerRows);
    }

    return { message: "Quiz answered successfully", submissionId: submission.id };
  }

  async isQuizAssignedToLearner(quizId: number, learnerId: number, trx: any) {
    return trx.select().from(learnerAssignment).where(and(eq(learnerAssignment.quizId, quizId), eq(learnerAssignment.learnerId, learnerId)));
  }

  async hasAlreadySubmittedQuiz(quizId: number, learnerId: number, trx: any) {
    return trx.select().from(quizSubmission).where(and(eq(quizSubmission.quizId, quizId), eq(quizSubmission.learnerId, learnerId)));
  }
}
