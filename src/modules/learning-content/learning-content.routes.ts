import { Router } from "express";
import multer from "multer";
import { catchAsync } from "@/utils/catch_async";
import { LearningContentController } from "./learning-content.controller";
import { protect } from "@/middlewares/protect.middleware";
import { LearningContentControllerType } from "./learning-content.types";
import { UserRole } from "../user/user.types";
import { validateRequest } from "@/middlewares/validate.middleware";
import { createContentDto, updateContentDto, getContentByIdDto, deleteContentDto, getContentByModuleDto,assignContentDto,assignQuizDto } from "./learning-content.dto";
import { get } from "http";
const controller: LearningContentControllerType = new LearningContentController();

const learningContentRouter = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// == Content ==
learningContentRouter.post('/create-content', protect(UserRole.ADMIN, UserRole.TUTOR), upload.single('file'), catchAsync(controller.create));

learningContentRouter.get('/:id',protect(UserRole.ADMIN, UserRole.TUTOR, UserRole.LEARNER), catchAsync(controller.getById));

learningContentRouter.put('/update-content/:id',protect(UserRole.ADMIN, UserRole.TUTOR), catchAsync(controller.update));

learningContentRouter.delete('/delete-content/:id',protect(UserRole.ADMIN, UserRole.TUTOR), catchAsync(controller.delete));


learningContentRouter.get('/getContentBytutor/:createdBy',protect(UserRole.ADMIN, UserRole.TUTOR, UserRole.LEARNER), catchAsync(controller.getByCreatedBy));


// == Quiz Routes ==
learningContentRouter.post('/create-quiz', protect(UserRole.ADMIN, UserRole.TUTOR), catchAsync(controller.createQuiz));

learningContentRouter.get('/quiz/:id', protect(UserRole.ADMIN, UserRole.TUTOR, UserRole.LEARNER), catchAsync(controller.getQuizById));

learningContentRouter.put('/update-quiz/:id', protect(UserRole.ADMIN, UserRole.TUTOR), catchAsync(controller.updateQuiz));

learningContentRouter.delete('/quiz/:id', protect(UserRole.ADMIN, UserRole.TUTOR), catchAsync(controller.deleteQuiz));

learningContentRouter.get('/quizzes', protect(UserRole.ADMIN, UserRole.TUTOR, UserRole.LEARNER), catchAsync(controller.getAllQuizzes));


learningContentRouter.post('/assign-content-to-Learner',protect(UserRole.ADMIN, UserRole.TUTOR),validateRequest(assignContentDto),catchAsync(controller.assignContent));

learningContentRouter.post('/assign-quiz-to-Learner',protect(UserRole.ADMIN, UserRole.TUTOR),validateRequest(assignQuizDto),catchAsync(controller.assignQuiz));
export default learningContentRouter;