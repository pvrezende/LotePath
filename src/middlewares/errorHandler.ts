import type { ErrorRequestHandler} from "express";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.statusCode,
            details: err.details
        });
    }
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation Error",
            details: err.flatten()
        });
    }

    console.error(err);
    return res.status(500).json({
        error: "Internal Server Error"
    });



}
