import { Router } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { AppDataSource } from "../database/AppDataSource.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createUserDTOSchema } from "../dtos/userDTO.js";

const usuarioService = new UsuarioService(AppDataSource);
const usuarioController = new UsuarioController(usuarioService);

const routerUser = Router();

routerUser.get("/", usuarioController.getAll.bind(usuarioController));
routerUser.get("/:id", usuarioController.getById.bind(usuarioController));
routerUser.post("/", validateBody(createUserDTOSchema), usuarioController.createUser.bind(usuarioController));

export default routerUser;