import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createInsumoDTOSchema } from "../dtos/InsumoDTO.js";
import { InsumoService } from "../services/InsumoService.js";
import { InsumoController } from "../controllers/InsumoController.js";

const insumoService = new InsumoService(AppDataSource);
const insumoController = new InsumoController(insumoService);

const insumoRoutes = Router();

insumoRoutes.post(
    "/lotes/:id/insumos",
    validateBody(createInsumoDTOSchema),
    insumoController.create.bind(insumoController)
);

insumoRoutes.delete(
    "/lotes/:id/insumos/:insumoId",
    insumoController.delete.bind(insumoController)
);

export default insumoRoutes;