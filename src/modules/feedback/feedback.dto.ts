import { z } from "zod";

// Creating feedback (both directions: learner <-> tutor)
export const createFeedbackDto = z.object({
  receiverId: z.number().min(1, "Receiver user ID is required"),
  feedbackText: z.string().min(1, "Feedback text is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
});

export const getFeedbackForUserDto = z.object({
  userId: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
    message: "Invalid user ID",
  }),
});

export const getFeedbackByGiverDto = z.object({
  giverId: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
    message: "Invalid giver user ID",
  }),
});

// Types for inference
export type CreateFeedbackInput = z.infer<typeof createFeedbackDto>;
export type GetFeedbackForUserInput = z.infer<typeof getFeedbackForUserDto>;
export type GetFeedbackByGiverInput = z.infer<typeof getFeedbackByGiverDto>;
