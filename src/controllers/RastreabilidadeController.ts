import { NextFunction, Request, Response } from "express";
import { RastreabilidadeService } from "../services/RastreabilidadeService.js";

export class RastreabilidadeController {
    private rastreabilidadeService: RastreabilidadeService;

    constructor(rastreabilidadeService: RastreabilidadeService) {
        this.rastreabilidadeService = rastreabilidadeService;
    }

    async getByLote(req: Request, res: Response, next: NextFunction) {
        try {
            const loteId = req.params.id as string;
            const lote = await this.rastreabilidadeService.getByLote(loteId);

            return res.status(200).json({ lote });
        } catch (error) {
            return next(error);
        }
    }

    async getByInsumo(req: Request, res: Response, next: NextFunction) {
        try {
            const valor = req.query.valor as string;

            if (!valor) {
                return res.status(400).json({
                    error: "Informe o parâmetro ?valor= com o código ou lote do insumo"
                });
            }

            const lotes = await this.rastreabilidadeService.getByInsumo(valor);

            return res.status(200).json({ lotes });
        } catch (error) {
            return next(error);
        }
    }
}