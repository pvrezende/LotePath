import { NextFunction, Request, Response } from "express";
import { InspecaoService } from "../services/InspecaoService.js";
import { CreateInspecaoDTO } from "../dtos/InspecaoDTO.js";

export class InspecaoController {
    private inspecaoService: InspecaoService;

    constructor(inspecaoService: InspecaoService) {
        this.inspecaoService = inspecaoService;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const loteId = req.params.id as string;
            const data = req.body as CreateInspecaoDTO;

            const lote = await this.inspecaoService.create(loteId, data, req.user?.id);

            return res.status(201).json({ lote });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const loteId = req.params.id as string;

            const lote = await this.inspecaoService.delete(loteId, req.user?.id);

            return res.status(200).json({
                message: "Inspeção excluída com sucesso",
                lote
            });
        } catch (error) {
            return next(error);
        }
    }
}
