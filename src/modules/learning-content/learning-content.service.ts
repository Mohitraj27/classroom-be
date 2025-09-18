import { LearningContentRepository,QuizRepository } from "./learning-content.repo";
import { LearningContentServiceType } from "./learning-content.types";
import { CreateContentInput, UpdateContentInput } from "./learning-content.dto";
import { uploadFileToS3 } from "@/utils/aws_helper";
import { CustomError } from "@/utils/custom_error";
import statusCodes from "@/constants/status_codes";
import {AssignContentTypeEnum} from "./learning-content.types";
export class LearningContentService implements LearningContentServiceType {
  constructor(
    private readonly learningContentRepo = new LearningContentRepository(),
    private readonly quizRepo = new QuizRepository()) {}

  async createContent(input: CreateContentInput, file: Express.Multer.File, userId: number) {
    try {
      if (!file) {
        throw new CustomError("File is required", statusCodes.BAD_REQUEST);
      }
      const s3Url = await uploadFileToS3(file, "contents");
      const contentData = {
        ...input,
        contentUrl: s3Url,
        createdBy: userId,
      };
      const result = await this.learningContentRepo.create(contentData);
      return { statusCode: statusCodes.CREATED, message: 'Content created successfully', s3Url};
    } catch (error) {
      throw error;
    }
  }

  async getContentById(id: number) {
    try {
      const content = await this.learningContentRepo.findById(id);
      if (!content) {
        throw new CustomError("Content not found", statusCodes.NOT_FOUND);
      }
      return content;
    } catch (error) {
      throw error;
    }
  }

  async updateContent(id: number, input: UpdateContentInput) {
    try {
      // Check if content exists
      const existingContent = await this.learningContentRepo.findById(id);
      if (!existingContent) {
        throw new CustomError("Content not found", statusCodes.NOT_FOUND);
      }

      const result = await this.learningContentRepo.update(id, input);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteContent(id: number) {
    try {
      // Check if content exists
      const existingContent = await this.learningContentRepo.findById(id);
      if (!existingContent) {
        throw new CustomError("Content not found", statusCodes.NOT_FOUND);
      }
      const result = await this.learningContentRepo.delete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  
  async getContentByCreatedBy(userId: number) {
    try {
      const contents = await this.learningContentRepo.findByCreatedBy(userId);
      return contents;
    } catch (error) {
      throw error;
    }
  }

  async createQuiz(data: any) {
    const data1 =  this.quizRepo.createQuiz(
      {
        moduleId: data.moduleId,
        title: data.title,
        totalMarks: data.totalMarks,
        createdBy: data.createdBy,
      },
      data.questions
    );
    return data1;
  }

  async getQuizById(id: number) {
    return this.quizRepo.getQuizById(id);
  }

  async updateQuiz(id: number, data: any) {
    return this.quizRepo.updateQuiz(id, data, data.questions);
  }

  async deleteQuiz(id: number) {
    return this.quizRepo.deleteQuiz(id);
  }

  async getAllQuizzes() {
    return this.quizRepo.getAllQuizzes();
  }
  async assignContentToLearners(data: { contentId: number; learnerIds: number[]; assignedBy: number }) {
    await Promise.all(data.learnerIds.map(async (learnerId) => {
       await this.quizRepo.validateLearner(learnerId);
    }));
    const values = data.learnerIds.map((learnerId) => ({
      type: AssignContentTypeEnum.CONTENT,
      contentId: data.contentId,
      learnerId: learnerId,
      assignedBy: data.assignedBy,
    }));

    return this.quizRepo.assignContent(values);
  }

  async assignQuizToLearners(data: { quizId: number; learnerIds: number[]; assignedBy: number }) {
    await Promise.all(data.learnerIds.map(async (learnerId) => {
      await this.quizRepo.validateLearner(learnerId);
    }));
    const values = data.learnerIds.map((learnerId) => ({
      type: AssignContentTypeEnum.QUIZ,
      quizId: data.quizId,
      learnerId: learnerId,
      assignedBy: data.assignedBy,
    }));

    return this.quizRepo.assignQuiz(values); 
  }
}