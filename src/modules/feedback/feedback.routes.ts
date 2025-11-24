import { Router } from 'express';
import { FeedbackController } from './feedback.controller';

const controller = new FeedbackController();
const feedbackRouter = Router();

feedbackRouter.post('/add-feedback-ofContent', (req, res, next) => controller.giveFeedback(req, res, next));
feedbackRouter.get('/for-user/:userId', (req, res, next) => controller.getFeedbackForUser(req, res, next));

export default feedbackRouter;
