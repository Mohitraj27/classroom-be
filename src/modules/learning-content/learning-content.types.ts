import { Request, Response, NextFunction } from "express";
import { CreateContentInput ,UpdateContentInput} from "./learning-content.dto";

export enum AssignContentTypeEnum {
    CONTENT = "CONTENT",
    QUIZ = "QUIZ"
}
export enum ContentTypeEnum {
  VIDEO = "video",
  PDF = "pdf",
  PPT = "ppt"
}
export interface LearningContentServiceType {
    createContent(input: CreateContentInput, file: Express.Multer.File, userId: number): Promise<any>;
    getContentById(id: number): Promise<any>;
    updateContent(id: number, input: UpdateContentInput): Promise<any>;
    deleteContent(id: number): Promise<any>;
    getContentByCreatedBy(userId: number): Promise<any>;
    createQuiz(data: any): Promise<any>;
    getQuizById(id: number): Promise<any>;
    updateQuiz(id: number, data: any): Promise<any>;
    deleteQuiz(id: number): Promise<any>;
    getAllQuizzes(): Promise<any>;
    assignContentToLearners(data: { contentId: number; learnerIds: number[]; assignedBy: number }): Promise<any>;
    assignQuizToLearners(data: { quizId: number; learnerIds: number[]; assignedBy: number }): Promise<any>;
}

export interface LearningContentControllerType {
    create(req: any, res: any, next: any): Promise<any>; 
    update(req: any, res: any, next: any): Promise<any>;
    getById(req: any, res: any, next: any): Promise<any>;
    delete(req: any, res: any, next: any): Promise<any>;
    getByCreatedBy(req: any, res: any, next: any): Promise<any>;
    createQuiz(req: any, res: any, next: any): Promise<any>;
    getQuizById(req: any, res: any, next: any): Promise<any>;
    updateQuiz(req: any, res: any, next: any): Promise<any>;
    deleteQuiz(req: any, res: any, next: any): Promise<any>;
    getAllQuizzes(req: any, res: any, next: any): Promise<any>;
    assignContent(req: any, res: any, next: any): Promise<any>;
    assignQuiz(req: any, res: any, next: any): Promise<any>;
}

export interface LearningContentRepositoryType{
    create(contentData: any, trx: any): Promise<any>;
    findById(id: number, trx: any): Promise<any>;
    update(id: number, input: UpdateContentInput, trx: any): Promise<any>;
    delete(id: number, trx: any): Promise<any>;
    findByCreatedBy(createdBy: number, trx: any): Promise<any>;
}

export interface QuizContentRepositoryType {
    createQuiz(quizData: any, questions: any[], trx: any): Promise<any>;
    getQuizById(id: number, trx: any): Promise<any>;
    updateQuiz(id: number, data: any, questions: any[] | undefined, trx: any): Promise<any>;
    deleteQuiz(id: number, trx: any): Promise<any>;
    getAllQuizzes(trx: any): Promise<any>;
    assignContent(values: any[], trx: any): Promise<any>;
    assignQuiz(values: any[], trx: any): Promise<any>;
    validateLearner(learnerId: number, trx: any): Promise<any>;
    checkDuplicateAssignment(quizId: number, learnerId: number, trx: any): Promise<any>;
    checkDuplicateAssigmentContent(contentId: number, learnerId: number, trx: any): Promise<any>;
}