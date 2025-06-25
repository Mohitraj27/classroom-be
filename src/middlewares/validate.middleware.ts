// src/middlewares/validate.middleware.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/utils/custom_error";

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed; 
      next();
    } catch (err: any) {
      const message =
        err.errors?.map((e: any) => e.message).join(", ") || "Invalid request";
      next(new CustomError(message, 400));
    }
  };
};
