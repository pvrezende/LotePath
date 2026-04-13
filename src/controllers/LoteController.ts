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
            const {
                produto_id,
                status,
                data_inicio,
                data_fim,
                page: pageRaw = '1',
                limit: limitRaw = '20'
            } = req.query;

            const page = Number(pageRaw);
            const limit = Number(limitRaw);

            if (!Number.isInteger(page) || page < 1) {
                return res.status(400).json({ error: "Parâmetro 'page' deve ser um inteiro maior ou igual a 1" });
            }
            if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
                return res.status(400).json({ error: "Parâmetro 'limit' deve ser um inteiro entre 1 e 100" });
            }

            const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (produto_id && !UUID_REGEX.test(produto_id as string)) {
                return res.status(400).json({ error: "Parâmetro 'produto_id' deve ser um UUID válido" });
            }

            const result = await this.loteService.getAllWithFilters(
                {
                    produto_id: produto_id as string,
                    status: status as string,
                    data_inicio: data_inicio as string,
                    data_fim: data_fim as string
                },
                page,
                limit
            );

            return res.status(200).json({
                status: 200,
                data: result.lotes,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    pages: Math.ceil(result.total / result.limit)
                }
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
