import { Router } from "express";
import userRoutes from "@/modules/user/user.routes";
import learningContentRoutes from "@/modules/learning-content/learning-content.routes";

const router = Router();
router.use("/users", userRoutes);
router.use("/learning-content", learningContentRoutes);

export default router;
