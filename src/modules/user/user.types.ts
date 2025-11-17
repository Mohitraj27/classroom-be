import { Request, Response, NextFunction } from "express";
import { AssignContentTypeEnum } from "../learning-content/learning-content.types";

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
export interface answerQuizInput{
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  marksObtained: number;
  learnerId: number,
  quizId: number,
  answers: string[]
}
export interface UserServiceType {
  exportUserToCSV(): Promise<string | null>;
  getUsers: (page:number,limit:number) => Promise<any>;
  getUser: (id: number) => Promise<any>;
  deleteUser: (id: number) => Promise<any>;
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
  getAllAssignedQuizorContent: (userId: number, type?: AssignContentTypeEnum, itemId?: number) => Promise<any>;
  answerQuiz: (answerQuizInput: answerQuizInput) => Promise<any>;
}

export interface UserControllerType {
  exportUserToCSV(req: Request,res: Response,next: NextFunction): Promise<any>;
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
  getAllAssignedQuizorContent(req:Request,res:Response,next:NextFunction):Promise<any>;
  answerQuiz(req:Request,res:Response,next:NextFunction):Promise<any>;
}
export interface UserRepositoryType {
  getAll(page: number, limit: number, trx: any): Promise<any>;
  getById(id: number, trx: any): Promise<any>;
  createSignupRequest(payload: signupUserInput, trx: any): Promise<any>;
  getByEmail(email: string, trx: any): Promise<any>;
  deleteUser(id: number, trx: any): Promise<any>;
  setResetToken(id: number, resetToken: resetTokenType, trx: any): Promise<any>;
  updatePassword(id: number, hashedPassword: string, trx: any): Promise<any>;
  checkForResetToken(payload: resetPasswordInput, trx: any): Promise<any>;
  getUserName(userName: string, trx: any): Promise<any>;
  showLearners(page: number, limit: number, trx: any): Promise<any>;
  showTutors(page: number, limit: number, trx: any): Promise<any>;
  showRequests(page: number, limit: number, trx: any): Promise<any>;
  getSignupRequestById(id: number, trx: any): Promise<any>;
  rejectSignupRequest(rejectsignupData: rejectionSignupRequestInput, trx: any): Promise<any>;
  insertUser(userPayload: signupUserInput, trx: any): Promise<any>;
  insertSignupRequest(signupData: signupUserInput, trx: any): Promise<any>;
  deleteSignupRequest(id: number, trx: any): Promise<any>;
  moveToHistory(data: any, trx: any): Promise<any>;
  updateProfile(id: number, userData: Partial<signupUserInput>, trx: any): Promise<any>;
  exportUserToCSV(trx: any): Promise<any>;
  getAllAssignedQuizzes(userId: number, trx: any): Promise<any>;
  getAllAssignedContents(userId: number, trx: any): Promise<any>;
  getAssignedQuiz(userId: number, quizId: number, trx: any): Promise<any>;
  getAssignedContent(userId: number, contentId: number, trx: any): Promise<any>;
  answerQuiz(input: answerQuizInput, trx: any): Promise<any>;
  isQuizAssignedToLearner(quizId: number, learnerId: number, trx: any): Promise<any>;
  hasAlreadySubmittedQuiz(quizId: number, learnerId: number, trx: any): Promise<any>;
}
export interface CustomErrorType {
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