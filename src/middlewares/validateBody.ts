import { Request } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";
import { RequestHandler } from "express";

export const validateBody = (schema: ZodSchema): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(new AppError("Dados Invalidos", 400, result.error.flatten()));

        };
        req.body = result.data;
    }
}