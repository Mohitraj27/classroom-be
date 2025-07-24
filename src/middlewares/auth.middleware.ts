// src/middlewares/auth.middleware.ts

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/utils/custom_error";
import httpStatus from "@/constants/status_codes";
import messages from "@/enums/common.enum";
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new CustomError(messages.ACCESS_DENIED, httpStatus.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
    throw new CustomError(messages.INVALID_TOKEN, httpStatus.UNAUTHORIZED);
  }
};
