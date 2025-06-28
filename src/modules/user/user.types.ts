
import { Request, Response, NextFunction } from "express";

export interface signupUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm_password?: string;
  contact_number: string;
  resetToken?: string | null;
}

export interface LoginUserInput {
  email: string;
  password: string;
}
export interface forgetPasswordInput {
  email: string;
}

export interface resetPasswordInput {
  resetToken: string;
  new_password: string;
}

export interface resetTokenType {
  resetToken: string;
}

export interface UserServiceType {
  getUsers: () => any;
  getUser: (id: number) => any;
  deleteUser: (id: number) => any;
  signupUser: (signupData: signupUserInput) => Promise<{ firstName: string; lastName: string; email: string; contact_number: string;}>;
  loginUser: (loginData: LoginUserInput) => Promise<{ accessToken: string; user: any }>;
  forgetPassword: (forgetData: forgetPasswordInput) => Promise<any>;
  resetPassword: (resetPasswordData: resetPasswordInput) => Promise<any>;
}

export interface UserControllerType {
  getAll(req: Request, res: Response, next: NextFunction): Promise<any>;
  getById(req: Request, res: Response, next: NextFunction): Promise<any>;
  signupUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  loginUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  logoutUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  forgetPassword(req: Request, res: Response, next: NextFunction): Promise<any>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<any>;
  delete(req: Request, res: Response, next: NextFunction): Promise<any>;
}
export interface CustomErrorType  {
  message: string;
  name?: string;
  stack?: string; 
  exactError?: unknown;    
  statusCode: number;
}
export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}