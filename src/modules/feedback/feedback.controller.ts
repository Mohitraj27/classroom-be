import { Request, Response, NextFunction } from 'express';
import { FeedbackService } from './feedback.service';

const service = new FeedbackService();

export class FeedbackController {
  async giveFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).send({ message: 'Unauthorized: User not found.' });
        return;
      }
      const { receiverId, feedbackText, rating } = req.body;
      const giverId = req.user.id; // extract from JWT/user session
      await service.giveFeedback({ giverId, receiverId, feedbackText, rating });
      res.status(201).send({ message: 'Feedback submitted.' });
    } catch (e) {
      next(e);
    }
  }
  
  async getFeedbackForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const feedbackList = await service.getFeedbackForUser(userId);
      res.status(200).send(feedbackList);
    } catch (e) {
      next(e);
    }
  }
}
