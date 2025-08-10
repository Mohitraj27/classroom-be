import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@/middlewares/response.middleware";
import { learningContentService } from './learning-content.service';
import messages from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
import { CustomError } from "@/utils/custom_error";
import { LearningContentServiceType } from "./learning-content.types";
import { createContentDto, CreateContentInput } from "./learning-content.dto";
import jwt from "jsonwebtoken";
const service: LearningContentServiceType = new learningContentService();

export class LearningContentController implements LearningContentServiceType {
  createContent(input: CreateContentInput, file: Express.Multer.File, userId: number): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        return sendResponse(res, statusCodes.UNAUTHORIZED, messages.NO_USER_LOGGED_IN);
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decoded.userId;

      const validatedData = createContentDto.parse({
        embedLink: req.body.embedLink,
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
      });

      const content = await service.createContent(validatedData, req.file!, userId);

      sendResponse(res, statusCodes.CREATED, "Content created successfully", content);
    } catch (err) {
      next(err);
    }
  }
}