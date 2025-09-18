import { db } from "@/config/db";
import { content, learnerAssignment, quiz, quizQuestion } from "./learning-content.model";
import { eq } from "drizzle-orm";
import { LearningContentRepositoryType,QuizContentRepositoryType } from "./learning-content.types";
import { user } from "@/modules/user/user.model";
import { UserRole } from "@/modules/user/user.types";
export class LearningContentRepository implements LearningContentRepositoryType {
  async create(data: any) {
    try {
      // Clean the data object to remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
      const result = await db.insert(content).values(cleanData as any);
      return result;
    } catch (error) {
      throw new Error(`Failed to create content: ${error}`);
    }
  }

  async findById(id: number) {
    try {
      const result = await db.select().from(content).where(eq(content.id, id));
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to find content by ID: ${error}`);
    }
  }

  async update(id: number, data: any) {
    try {
      const result = await db.update(content).set(data).where(eq(content.id, id));
      return result;
    } catch (error) {
      throw new Error(`Failed to update content: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      const result = await db.delete(content).where(eq(content.id, id));
      return result;
    } catch (error) {
      throw new Error(`Failed to delete content: ${error}`);
    }
  }

  async findByCreatedBy(createdBy: number) {
    try {
      const result = await db.select().from(content).where(eq(content.createdBy, createdBy));
      return result;
    } catch (error) {
      throw new Error(`Failed to find content by createdBy: ${error}`);
    }
  }
}

export class QuizRepository implements QuizContentRepositoryType {
  async createQuiz(quizData: any, questions: any[]) {
    const [createdQuiz] = await db.insert(quiz).values(quizData).$returningId();
    if (!createdQuiz) throw new Error('Failed to create quiz');
    const quizId = createdQuiz.id;
    const questionRecords = questions.map((q) => ({ ...q, quizId }));
    await db.insert(quizQuestion).values(questionRecords);

    return { ...createdQuiz, questions: questionRecords };
  }

  async getQuizById(id: number) {
    const [foundQuiz] = await db.select().from(quiz).where(eq(quiz.id, id));
    if (!foundQuiz) return null;

    const questions = await db.select().from(quizQuestion).where(eq(quizQuestion.quizId, id));
    return { ...foundQuiz, questions };
  }

  async updateQuiz(id: number, data: any, questions?: any[]) {
    await db.update(quiz).set(data).where(eq(quiz.id, id));

    if (questions && questions.length > 0) {
      // remove old questions and insert new (simplest approach)
      await db.delete(quizQuestion).where(eq(quizQuestion.quizId, id));
      const questionRecords = questions.map((q) => ({ ...q, quizId: id }));
      await db.insert(quizQuestion).values(questionRecords);
    }

    return this.getQuizById(id);
  }

  async deleteQuiz(id: number) {
    await db.delete(quizQuestion).where(eq(quizQuestion.quizId, id));
    await db.delete(quiz).where(eq(quiz.id, id));
    return { message: 'Quiz deleted successfully' };
  }

  async getAllQuizzes() {
    const allQuizzes = await db.select().from(quiz);
    return Promise.all(allQuizzes.map((q) => this.getQuizById(q.id)));
  }

  async assignContent(values: any[]) {
    return db.insert(learnerAssignment).values(values);
  }

  async assignQuiz(values: any[]) {
    return db.insert(learnerAssignment).values(values);
  }
  async validateLearner(learnerId: number) {
    const [foundLearner] = await db.select().from(user).where(eq(user.id, learnerId));
    if (!foundLearner) return null;
  
    if (foundLearner.role !== UserRole.LEARNER) {
      throw new Error(`User ${learnerId} is not a Learner. Content/Quiz can only be assigned to Learners.`);
    }
  
    return foundLearner;
  }
}