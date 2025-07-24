
import { Request, Response, NextFunction } from "express";

export enum UserRole {
  ADMIN = "admin",
  LEARNER = "learner",
  TUTOR = "tutor"
}
export interface signupUserInput {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirm_password?: string;
  contact_number: string;
  userName: string;
  country: string;
  city: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
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
  updatedAt: Date;
}

export interface UserServiceType {
  getUsers: () => any;
  getUser: (id: number) => any;
  deleteUser: (id: number) => any;
  signupUser: (signupData: signupUserInput) => Promise<void>;
  loginUser: (loginData: LoginUserInput) => Promise<{ user: any }>;
  forgetPassword: (forgetData: forgetPasswordInput) => Promise<any>;
  resetPassword: (resetPasswordData: resetPasswordInput) => Promise<any>;
  showLearners:() => any;
  showTutors:() => any;
}

export interface UserControllerType {
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<any>;
  getById(req: Request, res: Response, next: NextFunction): Promise<any>;
  signupUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  loginUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  logoutUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  forgetPassword(req: Request, res: Response, next: NextFunction): Promise<any>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<any>;
  delete(req: Request, res: Response, next: NextFunction): Promise<any>;
  getAllLearners(req: Request, res: Response, next: NextFunction): Promise<any>;
  getAllTutors(req: Request, res: Response, next: NextFunction): Promise<any>;
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