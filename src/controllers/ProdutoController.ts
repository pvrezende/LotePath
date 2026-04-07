import { NextFunction, Request, Response } from "express";
import { ProdutoService } from "../services/ProdutoService.js";
import { CreateProdutoDTO, UpdateProdutoDTO } from "../dtos/ProdutoDTO.js";

export class ProdutoController {
    private produtoService: ProdutoService;

    constructor(produtoService: ProdutoService) {
        this.produtoService = produtoService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const produtos = await this.produtoService.getAll();

            return res.status(200).json({
                status: 200,
                data: produtos
            });
        } catch (error) {
            return next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const produto = await this.produtoService.getById(id);

            return res.status(200).json({ produto });
        } catch (error) {
            return next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body as CreateProdutoDTO;
            const produto = await this.produtoService.create(data);

            return res.status(201).json({ produto });
        } catch (error) {
            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const data = req.body as UpdateProdutoDTO;
            const produto = await this.produtoService.update(id, data);

            return res.status(200).json({ produto });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await this.produtoService.delete(id);

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}