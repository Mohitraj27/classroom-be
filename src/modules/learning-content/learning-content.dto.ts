import { z } from "zod";

export const createContentDto = z.object({
  moduleId: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return undefined;
      const parsed = parseInt(String(val), 10);
      return isNaN(parsed) ? undefined : parsed;
    },
    z.number().min(1, "Module ID must be a positive number").optional()
  ),
  embedLink: z.string().url("Invalid embed link").optional(),
  metadata: z.record(z.any()).optional().default({}),
  contentType: z.enum(["video", "pdf", "ppt"]).default("video"),
});

export const updateContentDto = z.object({
  moduleId: z.number().min(1, "Module ID is required").optional(),
  embedLink: z.string().url("Invalid embed link").optional(),
  metadata: z.record(z.any()).optional(),
});

export const getContentByIdDto = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
    message: "Invalid content ID",
  }),
});

export const deleteContentDto = z.object({
  id: z.string().min(1, "Content ID is required"),
});

export const getContentByModuleDto = z.object({
  moduleId: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
    message: "Invalid module ID",
  }),
});

export const getContentCreatedByDto = z.object(
  {
    createdBy: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
      message: "Invalid user ID",
    }),
  }
);

export const createQuizDto = z.object({
  // moduleId: z.number().min(1, "Module ID is required"),
  title: z.string().min(1, "Title is required"),    
  totalMarks: z.number().min(1, "Total marks is required"), 
  createdBy: z.number().min(1, "Creator ID is required"),
  questions: z.array(
    z.object({
      questionText: z.string().min(1, "Question text is required"),
      options: z.array(z.string()).min(2, "At least two options required"),
      correctAnswer: z.string().min(1, "Correct answer required"),
      marks: z.number().min(1).default(1),
    })
  ).nonempty("Quiz must have at least one question")
});

export const updateQuizDto = z.object({
  title: z.string().optional(),
  totalMarks: z.number().optional(),
  questions: z.array(
    z.object({
      id: z.number().optional(), // for updating existing question
      questionText: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.string(),
      marks: z.number(),
    })
  ).optional()
});

export const assignContentOrQuizDto = z.object({
  type: z.enum(["CONTENT", "QUIZ"]),
  itemId: z.number().int(), // contentId or quizId
  learnerIds: z.array(z.number().int().positive()),
});

export type CreateContentInput = z.infer<typeof createContentDto>;
export type UpdateContentInput = z.infer<typeof updateContentDto>;
export type GetContentByIdInput = z.infer<typeof getContentByIdDto>;
export type DeleteContentInput = z.infer<typeof deleteContentDto>;
export type GetContentByModuleInput = z.infer<typeof getContentByModuleDto>;
export type GetContentCreatedByInput = z.infer<typeof getContentCreatedByDto>;
export type CreateQuizInput = z.infer<typeof createQuizDto>;
export type UpdateQuizInput = z.infer<typeof updateQuizDto>;
export type AssignContentOrQuizInput = z.infer<typeof assignContentOrQuizDto>;