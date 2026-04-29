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

    private isUuid(value: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        return uuidRegex.test(value);
    }

    async getByLote(idOuNumeroLote: string) {
        const where = this.isUuid(idOuNumeroLote)
            ? [
                  { id: idOuNumeroLote },
                  { numero_lote: idOuNumeroLote }
              ]
            : [
                  { numero_lote: idOuNumeroLote }
              ];

        const lote = await this.loteRepo.findOne({
            where,
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

        const primeiroInsumo = insumos[0];

        const lotesAfetados = insumos.map((insumo) => insumo.lote);

        return {
            insumo: {
                nome_insumo: primeiroInsumo.nome_insumo,
                codigo_insumo: primeiroInsumo.codigo_insumo,
                lote_insumo: primeiroInsumo.lote_insumo
            },
            lotesAfetados
        };
    }
}