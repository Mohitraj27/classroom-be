export interface FeedbackInput {
  giverId: number;
  receiverId: number;
  feedbackText: string;
  rating: number;
}

export interface FeedbackServiceType {
  giveFeedback(input: FeedbackInput): Promise<any>;
  getFeedbackForUser(userId: number): Promise<any>;
  getGivenFeedbackByUser(giverId: number): Promise<any>;
}
