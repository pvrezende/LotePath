import { DataSource, Repository } from "typeorm";
import { InsumoLote } from "../entities/Insumo_lote.js";
import { Lote } from "../entities/Lote.js";
import { CreateInsumoDTO } from "../dtos/InsumoDTO.js";
import { AppError } from "../errors/AppError.js";
import { AuditService } from "./AuditService.js";

export class InsumoService {
    private insumoRepo: Repository<InsumoLote>;
    private loteRepo: Repository<Lote>;
    private auditService: AuditService;

    constructor(appDataSource: DataSource) {
        this.insumoRepo = appDataSource.getRepository(InsumoLote);
        this.loteRepo = appDataSource.getRepository(Lote);
        this.auditService = new AuditService(appDataSource);
    }

    async create(loteId: string, data: CreateInsumoDTO, usuarioId?: string) {
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

        await this.auditService.createLog({
            modulo: "insumos",
            acao: "INSUMO_ADICIONADO",
            descricao: `Insumo ${insumo.nome_insumo} adicionado ao lote ${lote.numero_lote}`,
            usuarioId,
            detalhes: {
                loteId: lote.id,
                numero_lote: lote.numero_lote,
                insumoId: insumo.id,
                nome_insumo: insumo.nome_insumo,
                codigo_insumo: insumo.codigo_insumo,
                lote_insumo: insumo.lote_insumo,
                quantidade: insumo.quantidade,
                unidade: insumo.unidade
            }
        });

        return insumo;
    }

    async delete(loteId: string, insumoId: string, usuarioId?: string) {
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

        await this.auditService.createLog({
            modulo: "insumos",
            acao: "INSUMO_REMOVIDO",
            descricao: `Insumo ${insumo.nome_insumo} removido do lote ${lote.numero_lote}`,
            usuarioId,
            detalhes: {
                loteId: lote.id,
                numero_lote: lote.numero_lote,
                insumoId: insumo.id,
                nome_insumo: insumo.nome_insumo,
                codigo_insumo: insumo.codigo_insumo,
                lote_insumo: insumo.lote_insumo,
                quantidade: insumo.quantidade,
                unidade: insumo.unidade
            }
        });

        await this.insumoRepo.remove(insumo);
    }
}
