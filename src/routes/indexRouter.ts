import { Router } from "express";
import userRoutes from "./userRoutes";


const indexRouter = Router();

indexRouter.use("/usuarios", userRoutes);
export default indexRouter;