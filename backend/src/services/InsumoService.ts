import { DataSource, Repository } from "typeorm";
import { InsumoLote } from "../entities/Insumo_lote.js";
import { Lote } from "../entities/Lote.js";
import { CreateInsumoDTO } from "../dtos/InsumoDTO.js";
import { AppError } from "../errors/AppError.js";

export class InsumoService {
    private insumoRepo: Repository<InsumoLote>;
    private loteRepo: Repository<Lote>;

    constructor(appDataSource: DataSource) {
        this.insumoRepo = appDataSource.getRepository(InsumoLote);
        this.loteRepo = appDataSource.getRepository(Lote);
    }

    async create(loteId: string, data: CreateInsumoDTO) {
        const lote = await this.loteRepo.findOne({
            where: { id: loteId }
        });

        if (!lote) {
            throw new AppError("Lote não encontrado", 404);
        }

        if (lote.status !== "em_producao") {
            throw new AppError("Só é possível adicionar insumos a lotes em produção", 400);
        }

        const insumo = this.insumoRepo.create({
            lote,
            nome_insumo: data.nome_insumo,
            codigo_insumo: data.codigo_insumo ?? null,
            lote_insumo: data.lote_insumo ?? null,
            quantidade: data.quantidade,
            unidade: data.unidade
        });

        await this.insumoRepo.save(insumo);

        return insumo;
    }

    async delete(loteId: string, insumoId: string) {
        const lote = await this.loteRepo.findOne({
            where: { id: loteId }
        });

        if (!lote) {
            throw new AppError("Lote não encontrado", 404);
        }

        if (lote.status !== "em_producao") {
            throw new AppError("Só é possível remover insumos de lotes em produção", 400);
        }

        const insumo = await this.insumoRepo.findOne({
            where: {
                id: insumoId,
                lote: { id: loteId }
            },
            relations: {
                lote: true
            }
        });

        if (!insumo) {
            throw new AppError("Insumo não encontrado para este lote", 404);
        }

        await this.insumoRepo.remove(insumo);
    }
}