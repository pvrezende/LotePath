import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { ProdutoService } from "../services/ProdutoService.js";
import { ProdutoController } from "../controllers/ProdutoController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createProdutoDTOSchema, updateProdutoDTOSchema } from "../dtos/ProdutoDTO.js";

const produtoService = new ProdutoService(AppDataSource);
const produtoController = new ProdutoController(produtoService);

const produtoRoutes = Router();

produtoRoutes.get("/", produtoController.getAll.bind(produtoController));
produtoRoutes.get("/:id", produtoController.getById.bind(produtoController));
produtoRoutes.post("/", validateBody(createProdutoDTOSchema), produtoController.create.bind(produtoController));
produtoRoutes.put("/:id", validateBody(updateProdutoDTOSchema), produtoController.update.bind(produtoController));
produtoRoutes.delete("/:id", produtoController.delete.bind(produtoController));

export default produtoRoutes;