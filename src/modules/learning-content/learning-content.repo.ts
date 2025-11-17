import { db } from "@/config/db";
import { content, learnerAssignment, quiz, quizQuestion } from "./learning-content.model";
import { and, eq } from "drizzle-orm";
import { LearningContentRepositoryType,QuizContentRepositoryType } from "./learning-content.types";
import { user } from "@/modules/user/user.model";
import { UserRole } from "@/modules/user/user.types";
export class LearningContentRepository implements LearningContentRepositoryType {
  async create(data: any, trx: any) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
    const result = await trx.insert(content).values(cleanData as any);
    return result;
  }

  async findById(id: number, trx: any) {
    const result = await trx.select().from(content).where(eq(content.id, id));
    return result[0] || null;
  }

  async update(id: number, data: any, trx: any) {
    const result = await trx.update(content).set(data).where(eq(content.id, id));
    return result;
  }

  async delete(id: number, trx: any) {
    const result = await trx.delete(content).where(eq(content.id, id));
    return result;
  }

  async findByCreatedBy(createdBy: number, trx: any) {
    const result = await trx.select().from(content).where(eq(content.createdBy, createdBy));
    return result;
  }
}

export class QuizRepository implements QuizContentRepositoryType {
  async createQuiz(quizData: any, questions: any[], trx: any) {
    const [createdQuiz] = await trx.insert(quiz).values(quizData).$returningId();
    if (!createdQuiz) throw new Error('Failed to create quiz');
    const quizId = createdQuiz.id;
    const questionRecords = questions.map((q) => ({ ...q, quizId }));
    await trx.insert(quizQuestion).values(questionRecords);

    return { ...createdQuiz, questions: questionRecords };
  }

  async getQuizById(id: number, trx: any) {
    const [foundQuiz] = await trx.select().from(quiz).where(eq(quiz.id, id));
    if (!foundQuiz) return null;

    const questions = await trx.select().from(quizQuestion).where(eq(quizQuestion.quizId, id));
    return { ...foundQuiz, questions };
  }

  async updateQuiz(id: number, data: any, questions: any[] | undefined, trx: any) {
    await trx.update(quiz).set(data).where(eq(quiz.id, id));

    if (questions && questions.length > 0) {
      await trx.delete(quizQuestion).where(eq(quizQuestion.quizId, id));
      const questionRecords = questions.map((q) => ({ ...q, quizId: id }));
      await trx.insert(quizQuestion).values(questionRecords);
    }

    return this.getQuizById(id, trx);
  }

  async deleteQuiz(id: number, trx: any) {
    await trx.delete(quizQuestion).where(eq(quizQuestion.quizId, id));
    await trx.delete(quiz).where(eq(quiz.id, id));
    return { message: 'Quiz deleted successfully' };
  }

  async getAllQuizzes(trx: any) {
    const allQuizzes = await trx.select().from(quiz);
    return Promise.all(allQuizzes.map((q: { id: number; }) => this.getQuizById(q.id, trx)));
  }

  async assignContent(values: any[], trx: any) {
    return trx.insert(learnerAssignment).values(values);
  }

  async assignQuiz(values: any[], trx: any) {
    return trx.insert(learnerAssignment).values(values);
  }
  async validateLearner(learnerId: number, trx: any) {
    const [foundLearner] = await trx.select().from(user).where(eq(user.id, learnerId));
    if (!foundLearner) return null;

    if (foundLearner.role !== UserRole.LEARNER) {
      throw new Error(`User ${learnerId} is not a Learner. Content/Quiz can only be assigned to Learners.`);
    }

    return foundLearner;
  }
  async checkDuplicateAssignment(quizId: number, learnerId: number, trx: any) {
    const [existing] = await trx.select().from(learnerAssignment).where(
      and(eq(learnerAssignment.quizId, quizId), eq(learnerAssignment.learnerId, learnerId))
    );
    return existing ? true : false;
  }
  async checkDuplicateAssigmentContent(contentId: number, learnerId: number, trx: any) {
    const [existing] = await trx.select().from(learnerAssignment).where(
      and(eq(learnerAssignment.contentId, contentId), eq(learnerAssignment.learnerId, learnerId))
    );
    return existing ? true : false;
  }
}