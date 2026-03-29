import { Router } from "express";
import type { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { UsuarioController } from "../controllers/UsuarioController";
import { appDataSource } from "../data-source";
import { validateBody } from "../middlewares/validateBody";
import { createUserDTOSchema } from "../dtos/userDTO";


const UsuarioService = new UsuarioService(appDataSource);
const UsuarioController = new UsuarioController(UsuarioService);

const routerUser = Router();

routerUser.get("/",UsuarioController.getAll.bind(UsuarioController));
routerUser.get("/:id_user", UsuarioController.getById.bind(UsuarioController));
routerUser.post("/", validateBody(createUserDTOSchema), UsuarioController.createUser.bind(UsuarioController));

export default { routerUser };
