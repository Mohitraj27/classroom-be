import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@/middlewares/response.middleware";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await service.getUsers();
    sendResponse(res, 200, "Users fetched", users);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const user = await service.getUser(Number(req.params.id));
    sendResponse(res, 200, "User fetched", user);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const user = await service.createUser(req.body);
    sendResponse(res, 201, "User created", user);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    await service.deleteUser(Number(req.params.id));
    sendResponse(res, 204, "User deleted");
  }
}
