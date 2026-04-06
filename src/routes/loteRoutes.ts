import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { LoteService } from "../services/LoteService.js";
import { LoteController } from "../controllers/LoteController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createLoteDTOSchema, updateStatusLoteDTOSchema } from "../dtos/LoteDTO.js";

const loteService = new LoteService(AppDataSource);
const loteController = new LoteController(loteService);

const loteRoutes = Router();

loteRoutes.get("/", loteController.getAll.bind(loteController));
loteRoutes.get("/:id", loteController.getById.bind(loteController));
loteRoutes.post("/", validateBody(createLoteDTOSchema), loteController.create.bind(loteController));
loteRoutes.patch("/:id/status", validateBody(updateStatusLoteDTOSchema), loteController.updateStatus.bind(loteController));

export default loteRoutes;