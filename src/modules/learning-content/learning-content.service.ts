import { LearningContentRepository } from "./learning-content.repo";
import dotenv from "dotenv";
import { CreateContentInput } from "./learning-content.dto";
import { uploadFileToS3 } from "@/utils/aws_helper";
dotenv.config();
export class learningContentService implements learningContentService {
  constructor(private readonly learningContentRepo = new LearningContentRepository()) {}

  private repo = new LearningContentRepository();

  async createContent(input: CreateContentInput, file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new Error("File is required");
    }

    const s3Url = await uploadFileToS3(file, "contents");

    return this.repo.create({
      ...input,
      contentUrl: s3Url,
      createdBy: userId,
    });
  }
}
