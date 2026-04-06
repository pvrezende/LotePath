import { Router } from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRoutes);
indexRouter.use("/usuarios", userRoutes);

export default indexRouter;