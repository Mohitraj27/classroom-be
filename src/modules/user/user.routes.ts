// src/modules/user/user.routes.ts
import { Router } from "express";
import { catchAsync } from "@/utils/catch_async";
import { UserController } from "./user.controller";
import { protect } from "@/middlewares/protect.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import { signupUserDto,loginUserDto, forgetPasswordDto,resetPasswordDto, approveSignupRequestDto, rejectSignupRequestDto } from "./user.dto";
import { UserControllerType,UserRole } from "./user.types";
import { userInfo } from "os";

const controller: UserControllerType = new UserController();
const userRouter = Router();

userRouter.get("/getAllUsers",protect(UserRole.ADMIN),catchAsync(controller.getAllUsers));
userRouter.get("/getAllLearners",protect(UserRole.TUTOR,UserRole.ADMIN),catchAsync(controller.getAllLearners));
userRouter.get("/getAllTutors",protect(UserRole.ADMIN,UserRole.TUTOR),catchAsync(controller.getAllTutors));
userRouter.get("/getSingleUser/:id", protect(UserRole.ADMIN), catchAsync(controller.getById));

userRouter.post('/signup-request', validateRequest(signupUserDto), catchAsync(controller.signupUser));
userRouter.get('/getAllSignupRequest', protect(UserRole.ADMIN), catchAsync(controller.getAllSignupRequests));

userRouter.post("/approve-signupRequest",validateRequest(approveSignupRequestDto),protect(UserRole.ADMIN),catchAsync(controller.approveSignupRequest));
userRouter.post("/reject-signupRequest",validateRequest(rejectSignupRequestDto),protect(UserRole.ADMIN),catchAsync(controller.rejectSignupRequest));

userRouter.post("/login", validateRequest(loginUserDto), catchAsync(controller.loginUser));
userRouter.post("/logout", catchAsync(controller.logoutUser));
userRouter.post('/forget-password', validateRequest(forgetPasswordDto), catchAsync(controller.forgetPassword));
userRouter.post('/reset-password', validateRequest(resetPasswordDto), catchAsync(controller.resetPassword));

userRouter.get("/viewMyProfile", catchAsync(controller.myProfile));
userRouter.put("/update-profile",catchAsync(controller.updateUserProfile));
userRouter.delete("/:id", protect(UserRole.ADMIN), catchAsync(controller.delete));

export default userRouter;
