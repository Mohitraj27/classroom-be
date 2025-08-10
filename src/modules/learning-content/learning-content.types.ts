import { Request, Response, NextFunction } from "express";
import { CreateContentInput } from "./learning-content.dto";

export interface LearningContentServiceType {
    createContent(input: CreateContentInput, file: Express.Multer.File, userId: number): Promise<any>;
}

export interface LearningContentControllerType {
    create(req: any, res: any, next: any): Promise<any>; 
}