import { db } from "@/config/db";
import { content } from "./learning-content.model";
import { eq } from "drizzle-orm";
import { LearningContentRepositoryType } from "./learning-content.types";

export class LearningContentRepository implements LearningContentRepositoryType {
  async create(data: any) {
    try {
      // Clean the data object to remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
      const result = await db.insert(content).values(cleanData as any);
      return result;
    } catch (error) {
      throw new Error(`Failed to create content: ${error}`);
    }
  }

  async findById(id: number) {
    try {
      const result = await db.select().from(content).where(eq(content.id, id));
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to find content by ID: ${error}`);
    }
  }

  async update(id: number, data: any) {
    try {
      const result = await db.update(content).set(data).where(eq(content.id, id));
      return result;
    } catch (error) {
      throw new Error(`Failed to update content: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      const result = await db.delete(content).where(eq(content.id, id));
      return result;
    } catch (error) {
      throw new Error(`Failed to delete content: ${error}`);
    }
  }

  async findByModule(moduleId: number) {
    try {
      const result = await db.select().from(content).where(eq(content.moduleId, moduleId));
      return result;
    } catch (error) {
      throw new Error(`Failed to find content by module: ${error}`);
    }
  }
  async findByCreatedBy(createdBy: number) {
    try {
      const result = await db.select().from(content).where(eq(content.createdBy, createdBy));
      return result;
    } catch (error) {
      throw new Error(`Failed to find content by createdBy: ${error}`);
    }
  }
}
