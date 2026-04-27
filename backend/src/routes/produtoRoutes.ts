import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { ProdutoService } from "../services/ProdutoService.js";
import { ProdutoController } from "../controllers/ProdutoController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { Perfil } from "../types/Perfil.js";
import { createProdutoDTOSchema, updateProdutoDTOSchema } from "../dtos/ProdutoDTO.js";

const produtoService = new ProdutoService(AppDataSource);
const produtoController = new ProdutoController(produtoService);

const produtoRoutes = Router();

produtoRoutes.use(authMiddleware);

produtoRoutes.get("/", produtoController.getAll.bind(produtoController));
produtoRoutes.get("/:id", produtoController.getById.bind(produtoController));

produtoRoutes.post(
    "/",
    authorizeRoles(Perfil.GESTOR),
    validateBody(createProdutoDTOSchema),
    produtoController.create.bind(produtoController)
);

produtoRoutes.put(
    "/:id",
    authorizeRoles(Perfil.GESTOR),
    validateBody(updateProdutoDTOSchema),
    produtoController.update.bind(produtoController)
);

produtoRoutes.delete(
    "/:id",
    authorizeRoles(Perfil.GESTOR),
    produtoController.delete.bind(produtoController)
);

export default produtoRoutes;