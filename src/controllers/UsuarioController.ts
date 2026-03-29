import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { AppError } from "../errors/AppError";
import { CreateUserDTO } from "../dtos/userDTO";

export class UsuarioController {
    private usuarioService: UsuarioService;

    constructor(usuarioService: UsuarioService) {
        this.usuarioService = usuarioService;
    }

    async getAll(req: Request, res: Response) {
        const usuarios = await this.usuarioService.getAll();
        res.status(200).json({
            status: 200,
            data: usuarios
        });
    }

    async getById(req: Request, res: Response) {
        const id_user = req.params.id_user as string;

        try {
            const usuario = await this.usuarioService.getById(id_user);
            res.status(200).json({ usuario });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            }
        }

    }

    async createUser(req: Request, res: Response) {
        const data = req.body as CreateUserDTO;

        try {
            const novoUsuario = await this.usuarioService.createUser(data);
            res.status(201).json({ usuario: novoUsuario });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            }
        }
    }
}