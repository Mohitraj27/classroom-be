import { z } from "zod";

export const createContentDto = z.object({
  moduleId: z.number().optional(),
  embedLink: z.string().url("Invalid embed link").optional(),
  metadata: z.record(z.any()),
});

export type CreateContentInput = z.infer<typeof createContentDto>;