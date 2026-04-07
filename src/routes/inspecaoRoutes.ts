import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createInspecaoDTOSchema } from "../dtos/InspecaoDTO.js";
import { InspecaoService } from "../services/InspecaoService.js";
import { InspecaoController } from "../controllers/InspecaoController.js";

const inspecaoService = new InspecaoService(AppDataSource);
const inspecaoController = new InspecaoController(inspecaoService);

const inspecaoRoutes = Router();

inspecaoRoutes.use(authMiddleware);

inspecaoRoutes.post(
    "/lotes/:id/inspecao",
    validateBody(createInspecaoDTOSchema),
    inspecaoController.create.bind(inspecaoController)
);

export default inspecaoRoutes;