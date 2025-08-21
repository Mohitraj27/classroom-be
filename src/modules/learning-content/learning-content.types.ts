import { Request, Response, NextFunction } from "express";
import { CreateContentInput ,UpdateContentInput} from "./learning-content.dto";

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
    getContentByModule(moduleId: number): Promise<any>;
    getContentByCreatedBy(userId: number): Promise<any>;
}

export interface LearningContentControllerType {
    create(req: any, res: any, next: any): Promise<any>; 
    update(req: any, res: any, next: any): Promise<any>;
    getById(req: any, res: any, next: any): Promise<any>;
     delete(req: any, res: any, next: any): Promise<any>;
    getByModule(req: any, res: any, next: any): Promise<any>;
    getByCreatedBy(req: any, res: any, next: any): Promise<any>;
}

export interface LearningContentRepositoryType{
    create(contentData: any): Promise<any>;
    findById(id: number): Promise<any>;
    update(id: number, input: UpdateContentInput): Promise<any>;
    delete(id: number): Promise<any>;
    findByModule(moduleId: number): Promise<any>;
}