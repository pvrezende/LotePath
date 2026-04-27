import { DataSource, Repository } from "typeorm";
import { Lote } from "../entities/Lote.js";
import { InsumoLote } from "../entities/Insumo_lote.js";
import { AppError } from "../errors/AppError.js";

export class RastreabilidadeService {
    private loteRepo: Repository<Lote>;
    private insumoRepo: Repository<InsumoLote>;

    constructor(appDataSource: DataSource) {
        this.loteRepo = appDataSource.getRepository(Lote);
        this.insumoRepo = appDataSource.getRepository(InsumoLote);
    }

    async getByLote(loteId: string) {
        const lote = await this.loteRepo.findOne({
            where: { id: loteId },
            relations: {
                produto: true,
                operador: true,
                insumos: true,
                inspecao: {
                    inspetor: true
                }
            }
        });

        if (!lote) {
            throw new AppError("Lote não encontrado", 404);
        }

        return lote;
    }

    async getByInsumo(codigoOuLoteInsumo: string) {
        const insumos = await this.insumoRepo.find({
            where: [
                { codigo_insumo: codigoOuLoteInsumo },
                { lote_insumo: codigoOuLoteInsumo }
            ],
            relations: {
                lote: {
                    produto: true,
                    operador: true,
                    inspecao: {
                        inspetor: true
                    }
                }
            }
        });

        if (!insumos.length) {
            throw new AppError("Nenhum lote encontrado para esse insumo", 404);
        }

        return insumos;
    }
}