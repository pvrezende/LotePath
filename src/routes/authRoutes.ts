import { Router } from "express";
import { AppDataSource } from "../database/AppDataSource.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginDTOSchema } from "../dtos/authDTO.js";
import { AuthService } from "../services/AuthService.js";
import { AuthController } from "../controllers/AuthController.js";

const authService = new AuthService(AppDataSource);
const authController = new AuthController(authService);

const authRoutes = Router();

authRoutes.post("/login", validateBody(loginDTOSchema), authController.login.bind(authController));

export default authRoutes;