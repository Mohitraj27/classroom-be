import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@/middlewares/response.middleware";
import { LearningContentService } from './learning-content.service';
import messages from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
import { LearningContentServiceType, LearningContentControllerType, ContentTypeEnum} from "./learning-content.types";
import {  createContentDto,  updateContentDto,  getContentByIdDto,  deleteContentDto,  getContentByModuleDto, getContentCreatedByDto, updateQuizDto, createQuizDto ,assignContentDto,assignQuizDto} from "./learning-content.dto";
import jwt from "jsonwebtoken";

const service: LearningContentServiceType = new LearningContentService();

export class LearningContentController implements LearningContentControllerType {

  // == Create Content ==
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        sendResponse(res, statusCodes.UNAUTHORIZED, messages.NO_USER_LOGGED_IN);
        return;
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decoded.userId;
      const body = req.body || {};
      const validatedData = createContentDto.parse({
        moduleId: body.moduleId ? parseInt(body.moduleId, 10) : undefined,
        embedLink: body.embedLink || undefined,
        metadata: body.metadata ? (typeof body.metadata === 'string' ? JSON.parse(body.metadata) : body.metadata) : {},
        contentType: body.contentType ||ContentTypeEnum.VIDEO,
      });

      const content = await service.createContent(validatedData, req.file!, userId);

      sendResponse(res, statusCodes.CREATED, messages.CONTENT_CREATED, content);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedParams = getContentByIdDto.parse(req.params);
      const content = await service.getContentById(validatedParams.id);
      sendResponse(res, statusCodes.OK, messages.CONTENT_FETCHED, content);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedParams = getContentByIdDto.parse(req.params);
      const validatedData = updateContentDto.parse(req.body);
      const updatedContent = await service.updateContent(validatedParams.id, validatedData);
      sendResponse(res, statusCodes.OK, messages.CONTENT_UPDATED, updatedContent);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedParams = deleteContentDto.parse(req.params);
      await service.deleteContent(Number(validatedParams.id));
      sendResponse(res, statusCodes.OK, messages.CONTENT_DELETED);
    } catch (err) {
      next(err);
    }
  }

  async getByModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedParams = getContentByModuleDto.parse(req.params);
      const contents = await service.getContentByModule(validatedParams.moduleId);
      sendResponse(res, statusCodes.OK, messages.CONTENT_FETCHED, contents);
    } catch (err) {
      next(err);
    }
  }

  async getByCreatedBy(req:Request,res:Response,next:NextFunction): Promise<void>{
    try {
      const validatedParams = getContentCreatedByDto.parse(req.params);
      const contents = await service.getContentByCreatedBy(validatedParams.createdBy);
      sendResponse(res, statusCodes.OK, messages.CONTENT_FETCHED, contents);
    } catch (err) {
      next(err);
    }
  }
  // == Quiz Endpoints ==
  async createQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        sendResponse(res, statusCodes.UNAUTHORIZED, messages.NO_USER_LOGGED_IN);
        return;
      }
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const body = { ...req.body, createdBy: decoded.userId };
      const validatedData = createQuizDto.parse(body);
      const quiz = await service.createQuiz(validatedData);
      sendResponse(res, statusCodes.CREATED, messages.QUIZ_CREATED, quiz);
    } catch (err) {
      next(err);
    }
  }

  async getQuizById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quiz = await service.getQuizById(Number(req.params.id));
      if (!quiz) {
        sendResponse(res, statusCodes.NOT_FOUND, messages.QUIZ_NOT_FOUND);
        return;
      }
      sendResponse(res, statusCodes.OK, messages.QUIZ_FETCHED, quiz);
    } catch (err) {
      next(err);
    }
  }

  async updateQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = updateQuizDto.parse(req.body);
      const updated = await service.updateQuiz(Number(req.params.id), validatedData);
      sendResponse(res, statusCodes.OK, messages.QUIZ_UPDATED, updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.deleteQuiz(Number(req.params.id));
      sendResponse(res, statusCodes.OK, messages.QUIZ_DELETED);
    } catch (err) {
      next(err);
    }
  }

  async getAllQuizzes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quizzes = await service.getAllQuizzes();
      sendResponse(res, statusCodes.OK, messages.QUIZ_FETCHED, quizzes);
    } catch (err) {
      next(err);
    }
  }
  async assignContent(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.accessToken;
      if (!token) return sendResponse(res, 401, "No user logged in");
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const validated = assignContentDto.parse(req.body);
      const assignments = await service.assignContentToLearners({
        contentId: validated.contentId,
        learnerIds: validated.learnerIds,
        assignedBy: decoded.userId,
      });

      sendResponse(res, 201, "Content assigned successfully", assignments);
    } catch (err) {
      next(err);
    }
}

async assignQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.accessToken;
      if (!token) return sendResponse(res, 401, "No user logged in");

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const validated = assignQuizDto.parse(req.body);

      const assignments = await service.assignQuizToLearners({
        quizId: validated.quizId,
        learnerIds: validated.learnerIds,
        assignedBy: decoded.userId,
      });

      sendResponse(res, 201, "Quiz assigned successfully", assignments);
    } catch (err) {
      next(err);
    }
}

}
