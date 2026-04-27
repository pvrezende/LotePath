import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

type TokenPayload = {
    id: string;
    perfil: string;
    iat?: number;
    exp?: number;
};

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            perfil: string;
        };
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError("Token não informado", 401);
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            throw new AppError("Token mal formatado", 401);
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new AppError("JWT_SECRET não configurado no .env", 500);
        }

        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

        req.user = {
            id: decoded.id,
            perfil: decoded.perfil
        };

        return next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        return next(new AppError("Token inválido ou expirado", 401));
    }
}