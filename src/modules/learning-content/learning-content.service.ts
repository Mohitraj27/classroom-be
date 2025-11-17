import { LearningContentRepository,QuizRepository } from "./learning-content.repo";
import { LearningContentServiceType } from "./learning-content.types";
import { CreateContentInput, UpdateContentInput } from "./learning-content.dto";
import { uploadFileToS3 } from "@/utils/aws_helper";
import { CustomError } from "@/utils/custom_error";
import statusCodes from "@/constants/status_codes";
import {AssignContentTypeEnum} from "./learning-content.types";
import { useTransaction } from "@/utils/dbTranscation";
export class LearningContentService implements LearningContentServiceType {
  constructor(
    private readonly learningContentRepo = new LearningContentRepository(),
    private readonly quizRepo = new QuizRepository()) {}

  async createContent(input: CreateContentInput, file: Express.Multer.File, userId: number) {
    return useTransaction(async (trx: any) => {
      if (!file) {
        throw new CustomError("File is required", statusCodes.BAD_REQUEST);
      }
      const s3Url = await uploadFileToS3(file, "contents");
      const contentData = {
        ...input,
        contentUrl: s3Url,
        createdBy: userId,
      };
      const result = await this.learningContentRepo.create(contentData, trx);
      return { statusCode: statusCodes.CREATED, message: 'Content created successfully', s3Url };
    });
  }

  async getContentById(id: number) {
    return useTransaction(async (trx: any) => {
      const content = await this.learningContentRepo.findById(id, trx);
      if (!content) {
        throw new CustomError("Content not found", statusCodes.NOT_FOUND);
      }
      return content;
    });
  }

  async updateContent(id: number, input: UpdateContentInput) {
    return useTransaction(async (trx: any) => {
      const existingContent = await this.learningContentRepo.findById(id, trx);
      if (!existingContent) {
        throw new CustomError("Content not found", statusCodes.NOT_FOUND);
      }
      const result = await this.learningContentRepo.update(id, input, trx);
      return result;
    });
  }

  async deleteContent(id: number) {
    return useTransaction(async (trx: any) => {
      const existingContent = await this.learningContentRepo.findById(id, trx);
      if (!existingContent) {
        throw new CustomError("Content not found", statusCodes.NOT_FOUND);
      }
      const result = await this.learningContentRepo.delete(id, trx);
      return result;
    });
  }

  async getContentByCreatedBy(userId: number) {
    return useTransaction(async (trx: any) => {
      const contents = await this.learningContentRepo.findByCreatedBy(userId, trx);
      return contents;
    });
  }

  async createQuiz(data: any) {
    return useTransaction(async (trx: any) => {
      const result = await this.quizRepo.createQuiz(
        {
          title: data.title,
          totalMarks: data.totalMarks,
          createdBy: data.createdBy,
        },
        data.questions,
        trx
      );
      return result;
    });
  }

  async getQuizById(id: number) {
    return useTransaction(async (trx: any) => {
      return this.quizRepo.getQuizById(id, trx);
    });
  }

  async updateQuiz(id: number, data: any) {
    return useTransaction(async (trx: any) => {
      return this.quizRepo.updateQuiz(id, data, data.questions, trx);
    });
  }

  async deleteQuiz(id: number) {
    return useTransaction(async (trx: any) => {
      return this.quizRepo.deleteQuiz(id, trx);
    });
  }

  async getAllQuizzes() {
    return useTransaction(async (trx: any) => {
      return this.quizRepo.getAllQuizzes(trx);
    });
  }
  async assignContentToLearners(data: { contentId: number; learnerIds: number[]; assignedBy: number }) {
    return useTransaction(async (trx: any) => {
      // Validate all learners first
      await Promise.all(
        data.learnerIds.map(async (learnerId) => {
          await this.quizRepo.validateLearner(learnerId, trx);
          const alreadyAssigned = await this.quizRepo.checkDuplicateAssigmentContent(data.contentId, learnerId, trx);
          if (alreadyAssigned) {
            throw new Error(`Content ${data.contentId} is already assigned to learner ${learnerId}.`);
          }
        })
      );

      const values = data.learnerIds.map((learnerId) => ({
        type: AssignContentTypeEnum.CONTENT,
        contentId: data.contentId,
        learnerId: learnerId,
        assignedBy: data.assignedBy,
      }));

      return this.quizRepo.assignContent(values, trx);
    });
  }

  async assignQuizToLearners(data: { quizId: number; learnerIds: number[]; assignedBy: number }) {
    return useTransaction(async (trx: any) => {
      // Validate all learners first
      await Promise.all(
        data.learnerIds.map(async (learnerId) => {
          await this.quizRepo.validateLearner(learnerId, trx);
          const alreadyAssigned = await this.quizRepo.checkDuplicateAssignment(data.quizId, learnerId, trx);
          if (alreadyAssigned) {
            throw new Error(`Quiz ${data.quizId} is already assigned to learner ${learnerId}.`);
          }
        })
      );

      const values = data.learnerIds.map((learnerId) => ({
        type: AssignContentTypeEnum.QUIZ,
        quizId: data.quizId,
        learnerId: learnerId,
        assignedBy: data.assignedBy,
      }));

      return this.quizRepo.assignQuiz(values, trx);
    });
  }
}