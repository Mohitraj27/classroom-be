import { db } from "@/config/db";
import { content } from "./learning-content.model";
// import { createContentInput } from "./learning-content.dto";

export class LearningContentRepository {
  async create(data: any) {
    return db.insert(content).values(data);
  }
}
