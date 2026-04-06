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

            const inspecao = await this.inspecaoService.create(loteId, data);

            return res.status(201).json({ inspecao });
        } catch (error) {
            return next(error);
        }
    }
}