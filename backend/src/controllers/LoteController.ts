import { NextFunction, Request, Response } from "express";
import { LoteService } from "../services/LoteService.js";
import { CreateLoteDTO, UpdateStatusLoteDTO } from "../dtos/LoteDTO.js";

export class LoteController {
    private loteService: LoteService;

    constructor(loteService: LoteService) {
        this.loteService = loteService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const lotes = await this.loteService.getAll();

            return res.status(200).json({
                status: 200,
                data: lotes
            });
        } catch (error) {
            return next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const lote = await this.loteService.getById(id);

            return res.status(200).json({ lote });
        } catch (error) {
            return next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as CreateLoteDTO;
            const lote = await this.loteService.create(data);

            return res.status(201).json({ lote });
        } catch (error) {
            return next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const data = req.body as UpdateStatusLoteDTO;
            const lote = await this.loteService.updateStatus(id, data);

            return res.status(200).json({ lote });
        } catch (error) {
            return next(error);
        }
    }
}