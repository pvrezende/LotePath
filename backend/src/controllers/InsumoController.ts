import { NextFunction, Request, Response } from "express";
import { InsumoService } from "../services/InsumoService.js";
import { CreateInsumoDTO } from "../dtos/InsumoDTO.js";

export class InsumoController {
    private insumoService: InsumoService;

    constructor(insumoService: InsumoService) {
        this.insumoService = insumoService;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const loteId = req.params.id as string;
            const data = req.body as CreateInsumoDTO;

            const insumo = await this.insumoService.create(loteId, data);

            return res.status(201).json({ insumo });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const loteId = req.params.id as string;
            const insumoId = req.params.insumoId as string;

            await this.insumoService.delete(loteId, insumoId);

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}