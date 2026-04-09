import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { Perfil } from "../types/Perfil.js";
import { createInsumoDTOSchema } from "../dtos/InsumoDTO.js";
import { InsumoService } from "../services/InsumoService.js";
import { InsumoController } from "../controllers/InsumoController.js";

const insumoService = new InsumoService(AppDataSource);
const insumoController = new InsumoController(insumoService);

const insumoRoutes = Router();

insumoRoutes.use(authMiddleware);

insumoRoutes.post(
    "/lotes/:id/insumos",
    authorizeRoles(Perfil.OPERADOR, Perfil.GESTOR),
    validateBody(createInsumoDTOSchema),
    insumoController.create.bind(insumoController)
);

insumoRoutes.delete(
    "/lotes/:id/insumos/:insumoId",
    authorizeRoles(Perfil.OPERADOR, Perfil.GESTOR),
    insumoController.delete.bind(insumoController)
);

export default insumoRoutes;