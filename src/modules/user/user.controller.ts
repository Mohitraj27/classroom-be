import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@/middlewares/response.middleware";
import { UserService } from "./user.service";
import messages from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
import { CustomError } from "@/utils/custom_error";
import { UserServiceType, UserControllerType } from "./user.types";
const service: UserServiceType = new UserService();

export class UserController implements UserControllerType {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try{
      const users = await service.getUsers();
      sendResponse(res, statusCodes.OK, messages.USERS_FETCHED, users);
    }catch(err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try{
      const user = await service.getUser(req.params.id as unknown as number);
      sendResponse(res, statusCodes.OK, messages.USER_FETCHED, user);
    }catch(err) {
      next(err);
    }
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
      const loggedInUser: any = await service.loginUser(req.body);
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

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.forgetPassword({ email: req.body.email });
      sendResponse(res, statusCodes.OK, messages.FORGET_PASSWORD_SUCCESS,result);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try{
      const resetToken = req.query.token as string;
      if (!resetToken) {
        throw new CustomError(messages.INVALID_TOKEN, statusCodes.BAD_REQUEST);
      }
      const result = await service.resetPassword({ resetToken, new_password: req.body.new_password });
      sendResponse(res, statusCodes.OK, messages.PASSWORD_RESET_SUCCESS,result);
    }catch(err) {
      next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try{
      await service.deleteUser(req.params.id as unknown as number);
      sendResponse(res, statusCodes.OK, messages.USER_DELETED);
    }catch(err) {
      next(err);
    }
  }
}
