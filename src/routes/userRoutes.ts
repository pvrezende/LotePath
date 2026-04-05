import { Router } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { UsuarioController } from "../controllers/UsuarioController";
import { AppDataSource } from "../database/AppDataSource.js";
import { validateBody } from "../middlewares/validateBody";
import { createUserDTOSchema } from "../dtos/userDTO";


const usuarioService = new UsuarioService(AppDataSource);
const usuarioController = new UsuarioController(usuarioService);

const routerUser = Router();

routerUser.get("/", usuarioController.getAll.bind(usuarioController));
routerUser.get("/:id_user", usuarioController.getById.bind(usuarioController));
routerUser.post("/", validateBody(createUserDTOSchema), usuarioController.createUser.bind(usuarioController));

export default routerUser;
