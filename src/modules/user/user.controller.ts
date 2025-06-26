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

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const loggedInUser = await service.loginUser(req.body);
      res.cookie('accessToken', loggedInUser.accessToken, {
          httpOnly: true,        // Prevents XSS attacks
          secure: process.env.NODE_ENV === 'production', // HTTPS only in production
          sameSite: 'strict',    // CSRF protection
          maxAge: 8 * 60 * 60 * 1000 // 8 hours in milliseconds
      });
      sendResponse(res, statusCodes.OK, messages.LOGIN_SUCCESS, {
          accessToken: loggedInUser.accessToken,
          user: loggedInUser.user
      });
    } catch (err) {
      next(err);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try{
      if (!req.cookies.accessToken) {
        return sendResponse(res, statusCodes.UNAUTHORIZED, messages.NO_USER_LOGGED_IN);
      }
      res.clearCookie("accessToken");
      sendResponse(res, statusCodes.OK, messages.LOGOUT_SUCCESS);
    }catch(err) {
      next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    await service.deleteUser(Number(req.params.id));
    sendResponse(res, 204, "User deleted");
  }
}
