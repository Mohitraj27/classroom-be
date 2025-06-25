import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@/middlewares/response.middleware";
import { UserService } from "./user.service";
import messages from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
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

  async signupUser(req:Request, res:Response, next:NextFunction){
    try{
      const user = await service.signupUser(req.body);
      sendResponse(res,statusCodes.CREATED , messages.USER_SIGNUP_SUCCESS, user);
    } catch(err){
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    await service.deleteUser(Number(req.params.id));
    sendResponse(res, 204, "User deleted");
  }
}
