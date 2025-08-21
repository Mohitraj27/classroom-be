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
)
export type CreateContentInput = z.infer<typeof createContentDto>;
export type UpdateContentInput = z.infer<typeof updateContentDto>;
export type GetContentByIdInput = z.infer<typeof getContentByIdDto>;
export type DeleteContentInput = z.infer<typeof deleteContentDto>;
export type GetContentByModuleInput = z.infer<typeof getContentByModuleDto>;
export type GetContentCreatedByInput = z.infer<typeof getContentCreatedByDto>;