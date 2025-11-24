import { Router } from "express";
import userRoutes from "@/modules/user/user.routes";
import learningContentRoutes from "@/modules/learning-content/learning-content.routes";
import feedbackRoutes from "@/modules/feedback/feedback.routes";

const router = Router();
router.use("/users", userRoutes);
router.use("/learning-content", learningContentRoutes);
router.use("/feedback", feedbackRoutes);

export default router;
