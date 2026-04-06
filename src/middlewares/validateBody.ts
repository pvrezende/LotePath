import { RequestHandler } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";

export const validateBody = (schema: ZodSchema): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(new AppError("Dados inválidos", 400, result.error.flatten()));
        }

        req.body = result.data;
        next();
    };
};