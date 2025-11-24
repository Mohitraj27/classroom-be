import { FeedbackInput, FeedbackServiceType } from './feedback.types';
import { FeedbackRepository } from './feedback.repo';

export class FeedbackService implements FeedbackServiceType {
  private repo = new FeedbackRepository();

  async giveFeedback(input: FeedbackInput) {
    return this.repo.create(input);
  }

  async getFeedbackForUser(userId: number) {
    return this.repo.getByReceiverId(userId);
  }

  async getGivenFeedbackByUser(giverId: number) {
    return this.repo.getByGiverId(giverId);
  }
}
