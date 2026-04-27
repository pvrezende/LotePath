import { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import { CreateUserDTO } from "../dtos/userDTO.js";

export class UsuarioController {
    private usuarioService: UsuarioService;

    constructor(usuarioService: UsuarioService) {
        this.usuarioService = usuarioService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await this.usuarioService.getAll();

            return res.status(200).json({
                status: 200,
                data: usuarios
            });
        } catch (error) {
            return next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const usuario = await this.usuarioService.getById(id);

            return res.status(200).json({ usuario });
        } catch (error) {
            return next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as CreateUserDTO;
            const novoUsuario = await this.usuarioService.createUser(data);

            return res.status(201).json({ usuario: novoUsuario });
        } catch (error) {
            return next(error);
        }
    }
}