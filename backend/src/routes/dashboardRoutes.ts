import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { DashboardService } from "../services/DashboardService.js";
import { DashboardController } from "../controllers/DashboardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { Perfil } from "../types/Perfil.js";

const dashboardService = new DashboardService(AppDataSource);
const dashboardController = new DashboardController(dashboardService);

const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get(
    "/dashboard",
    authorizeRoles(Perfil.OPERADOR, Perfil.INSPETOR, Perfil.GESTOR),
    dashboardController.get.bind(dashboardController)
);

export default dashboardRoutes;