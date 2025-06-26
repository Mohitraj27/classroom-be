// src/middlewares/role.middleware.ts

import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/utils/custom_error";
import httpStatus from "@/constants/status_codes";
import messages from "@/enums/common.enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        role?: string;
        [key: string]: any;
      };
    }
  }
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new CustomError(
        messages.FORBIDDEN_ACCESS,
        httpStatus.FORBIDDEN
      );
    }

    next();
  };
};
