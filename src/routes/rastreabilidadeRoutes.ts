import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { RastreabilidadeService } from "../services/RastreabilidadeService.js";
import { RastreabilidadeController } from "../controllers/RastreabilidadeController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { Perfil } from "../types/Perfil.js";

const rastreabilidadeService = new RastreabilidadeService(AppDataSource);
const rastreabilidadeController = new RastreabilidadeController(rastreabilidadeService);

const rastreabilidadeRoutes = Router();

rastreabilidadeRoutes.use(authMiddleware);

rastreabilidadeRoutes.get(
    "/rastreabilidade/lote/:id",
    authorizeRoles(Perfil.OPERADOR, Perfil.INSPETOR, Perfil.GESTOR),
    rastreabilidadeController.getByLote.bind(rastreabilidadeController)
);

rastreabilidadeRoutes.get(
    "/rastreabilidade/insumo",
    authorizeRoles(Perfil.OPERADOR, Perfil.INSPETOR, Perfil.GESTOR),
    rastreabilidadeController.getByInsumo.bind(rastreabilidadeController)
);

export default rastreabilidadeRoutes;