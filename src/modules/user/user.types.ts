
import { Request, Response, NextFunction } from "express";

export enum UserRole {
  ADMIN = "admin",
  LEARNER = "learner",
  TUTOR = "tutor"
}
export enum signupRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}
export enum userFields {
  role = "role",
  userName = "userName",
  email = "email",
}
export interface signupUserInput {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirm_password?: string;
  contact_number: string;
  userName: string;
  resetToken?: string;
  status: signupRequestStatus;
  rejectionReason?: string;
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

export interface approveSignupRequestInput {
  id: number, 
  role: UserRole,
}
export interface rejectionSignupRequestInput{
  id: number;
  rejectionReason: string;
}
export interface UserServiceType {
  getUsers: (page:number,limit:number) => any;
  getUser: (id: number) => any;
  deleteUser: (id: number) => any;
  signupUser: (signupData: signupUserInput) => Promise<any>;
  loginUser: (loginData: LoginUserInput) => Promise<{ user: any }>;
  forgetPassword: (forgetData: forgetPasswordInput) => Promise<any>;
  resetPassword: (resetPasswordData: resetPasswordInput) => Promise<any>;
  showLearners:(page:number,limit:number) => any;
  showTutors:(page:number,limit:number) => any;
  showSignupRequests:(page:number,limit:number) => any;
  approveSignupRequest: (approveSignRequestInput: approveSignupRequestInput) => Promise<any>;
  rejectSignupRequest: (rejectSignupRequest: rejectionSignupRequestInput) => Promise<any>;
  updateUserProfile: (updatedUser: number, updatedData: Partial<signupUserInput>) => Promise<any>;
  myProfile: (loggedInUserId: any) => any;
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
  getAllSignupRequests(req: Request, res: Response, next: NextFunction): Promise<any>;
  approveSignupRequest(req: Request, res: Response, next: NextFunction): Promise<any>;
  rejectSignupRequest(req: Request, res: Response, next: NextFunction): Promise<any>;
  updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<any>;
  myProfile(req: Request, res: Response, next: NextFunction): Promise<any>;
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