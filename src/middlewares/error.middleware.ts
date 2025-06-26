import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";
import messages from "@/enums/common.enum"; 
import statusCodes from "@/constants/status_codes";
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message ||  messages.INTERNAL_SERVER_ERROR;

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
