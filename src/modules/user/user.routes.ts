// src/modules/user/user.routes.ts
import { Router } from "express";
import { catchAsync } from "@/utils/catch_async";
import { UserController } from "./user.controller";
import { protect } from "@/middlewares/protect.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";
import { CreateUserDto } from "./user.dto";

const controller = new UserController();
const userRouter = Router();

userRouter.get(
  "/",
  ...protect("admin", "manager"),
  catchAsync(controller.getAll)
);

userRouter.get("/:id", ...protect("admin"), catchAsync(controller.getById));

userRouter.post(
  "/",
  ...protect("admin"),
  validateRequest(CreateUserDto),
  catchAsync(controller.create)
);

userRouter.delete("/:id", ...protect("admin"), catchAsync(controller.delete));

export default userRouter;
