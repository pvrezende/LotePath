import { Router } from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import produtoRoutes from "./produtoRoutes.js";
import loteRoutes from "./loteRoutes.js";
import inspecaoRoutes from "./inspecaoRoutes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRoutes);
indexRouter.use("/usuarios", userRoutes);
indexRouter.use("/produtos", produtoRoutes);
indexRouter.use("/lotes", loteRoutes);
indexRouter.use(inspecaoRoutes);

export default indexRouter;