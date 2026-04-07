import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { LoginDTO } from "../dtos/authDTO.js";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as LoginDTO;
            const resultado = await this.authService.login(data);

            return res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    }
}