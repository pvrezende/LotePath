import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { Perfil } from "../types/Perfil.js";

export function authorizeRoles(...allowedRoles: Perfil[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError("Usuário não autenticado", 401));
        }

        const userPerfil = req.user.perfil as Perfil;

        if (!allowedRoles.includes(userPerfil)) {
            return next(new AppError("Acesso negado para este perfil", 403));
        }

        return next();
    };
}