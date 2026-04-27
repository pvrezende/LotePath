import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { LoteService } from "../services/LoteService.js";
import { LoteController } from "../controllers/LoteController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { Perfil } from "../types/Perfil.js";
import { createLoteDTOSchema, updateStatusLoteDTOSchema } from "../dtos/LoteDTO.js";

const loteService = new LoteService(AppDataSource);
const loteController = new LoteController(loteService);

const loteRoutes = Router();

loteRoutes.use(authMiddleware);

loteRoutes.get(
    "/",
    authorizeRoles(Perfil.OPERADOR, Perfil.INSPETOR, Perfil.GESTOR),
    loteController.getAll.bind(loteController)
);

loteRoutes.get(
    "/:id",
    authorizeRoles(Perfil.OPERADOR, Perfil.INSPETOR, Perfil.GESTOR),
    loteController.getById.bind(loteController)
);

loteRoutes.post(
    "/",
    authorizeRoles(Perfil.OPERADOR, Perfil.GESTOR),
    validateBody(createLoteDTOSchema),
    loteController.create.bind(loteController)
);

loteRoutes.patch(
    "/:id/status",
    authorizeRoles(Perfil.OPERADOR, Perfil.GESTOR),
    validateBody(updateStatusLoteDTOSchema),
    loteController.updateStatus.bind(loteController)
);

export default loteRoutes;