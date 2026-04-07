import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { RastreabilidadeService } from "../services/RastreabilidadeService.js";
import { RastreabilidadeController } from "../controllers/RastreabilidadeController.js";

const rastreabilidadeService = new RastreabilidadeService(AppDataSource);
const rastreabilidadeController = new RastreabilidadeController(rastreabilidadeService);

const rastreabilidadeRoutes = Router();

rastreabilidadeRoutes.get(
    "/rastreabilidade/lote/:id",
    rastreabilidadeController.getByLote.bind(rastreabilidadeController)
);

rastreabilidadeRoutes.get(
    "/rastreabilidade/insumo",
    rastreabilidadeController.getByInsumo.bind(rastreabilidadeController)
);

export default rastreabilidadeRoutes;