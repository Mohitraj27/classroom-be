import { Router } from "express";
import multer from "multer";
import { catchAsync } from "@/utils/catch_async";
import { LearningContentController } from "./learning-content.controller";
import { protect } from "@/middlewares/protect.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import { LearningContentControllerType } from "./learning-content.types";
import { UserRole } from "../user/user.types";

const controller: LearningContentControllerType = new LearningContentController();


const learningContentRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });
learningContentRouter.post('/create-content',protect(UserRole.ADMIN,UserRole.TUTOR),upload.single('file'), catchAsync(controller.create));

export default learningContentRouter;