import { db } from '@/config/db';
import { feedback } from './feedback.model';
import { eq } from 'drizzle-orm';

export class FeedbackRepository {
  async create(feedbackData: any) {
    return db.insert(feedback).values(feedbackData);
  }
  async getByReceiverId(receiverId: number) {
    return db.select().from(feedback).where(eq(feedback.receiverId, receiverId));
  }
    async getByGiverId(giverId: number) {
    return db.select().from(feedback).where(eq(feedback.giverId, giverId));
  }
  
}

