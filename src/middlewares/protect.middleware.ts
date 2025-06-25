// src/middlewares/protect.middleware.ts
import { authenticate } from "./auth.middleware";
import { authorizeRoles } from "./role.middleware";
import { RequestHandler } from "express";

export const protect = (...roles: string[]): RequestHandler[] => [
  authenticate,
  authorizeRoles(...roles),
];
