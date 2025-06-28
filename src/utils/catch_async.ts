import { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsync = (
  fn: (...args: any[]) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

