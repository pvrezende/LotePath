import { Router } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { AppDataSource } from "../database/AppDataSource.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createUserDTOSchema } from "../dtos/userDTO.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { Perfil } from "../types/Perfil.js";

const usuarioService = new UsuarioService(AppDataSource);
const usuarioController = new UsuarioController(usuarioService);

const routerUser = Router();

routerUser.use(authMiddleware);
routerUser.use(authorizeRoles(Perfil.GESTOR));

routerUser.get("/", usuarioController.getAll.bind(usuarioController));
routerUser.get("/:id", usuarioController.getById.bind(usuarioController));
routerUser.post("/", validateBody(createUserDTOSchema), usuarioController.createUser.bind(usuarioController));

export default routerUser;
