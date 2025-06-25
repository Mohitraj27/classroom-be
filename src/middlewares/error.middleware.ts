import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the full error in dev or prod logs
  logger.error(
    `[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${message}, Error:: ${err.stack || err}`
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
