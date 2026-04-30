import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { AuditService } from "../services/AuditService.js";
import { AuditController } from "../controllers/AuditController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { Perfil } from "../types/Perfil.js";

const auditService = new AuditService(AppDataSource);
const auditController = new AuditController(auditService);

const auditRoutes = Router();

auditRoutes.use(authMiddleware);

auditRoutes.get(
    "/auditoria",
    authorizeRoles(Perfil.GESTOR),
    auditController.getAll.bind(auditController)
);

export default auditRoutes;
