import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.use("/api", routes);
app.use(errorMiddleware);

export default app;
