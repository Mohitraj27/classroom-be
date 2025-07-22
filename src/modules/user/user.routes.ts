// src/modules/user/user.routes.ts
import { Router } from "express";
import { catchAsync } from "@/utils/catch_async";
import { UserController } from "./user.controller";
import { protect } from "@/middlewares/protect.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import { signupUserDto,loginUserDto, forgetPasswordDto,resetPasswordDto } from "./user.dto";
import { UserControllerType } from "./user.types";

const controller: UserControllerType = new UserController();
const userRouter = Router();

userRouter.get(
  "/",
  ...protect("admin", "learner","tutor"),
  catchAsync(controller.getAll)
);

userRouter.get("/:id", ...protect("admin"), catchAsync(controller.getById));

userRouter.post('/signup', validateRequest(signupUserDto), catchAsync(controller.signupUser));
userRouter.post("/login", validateRequest(loginUserDto), catchAsync(controller.loginUser));
userRouter.post("/logout", catchAsync(controller.logoutUser));
userRouter.post('/forget-password', validateRequest(forgetPasswordDto), catchAsync(controller.forgetPassword));
userRouter.post('/reset-password', validateRequest(resetPasswordDto), catchAsync(controller.resetPassword));
userRouter.delete("/:id", ...protect("admin"), catchAsync(controller.delete));

export default userRouter;
