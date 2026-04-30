import { DataSource, Repository } from "typeorm";
import { InspecaoLote } from "../entities/Inspecao_lote.js";
import { Lote } from "../entities/Lote.js";
import { Usuario } from "../entities/Usuario.js";
import { CreateInspecaoDTO } from "../dtos/InspecaoDTO.js";
import { AppError } from "../errors/AppError.js";
import { AuditService } from "./AuditService.js";

export class InspecaoService {
    private inspecaoRepo: Repository<InspecaoLote>;
    private loteRepo: Repository<Lote>;
    private usuarioRepo: Repository<Usuario>;
    private auditService: AuditService;

    constructor(appDataSource: DataSource) {
        this.inspecaoRepo = appDataSource.getRepository(InspecaoLote);
        this.loteRepo = appDataSource.getRepository(Lote);
        this.usuarioRepo = appDataSource.getRepository(Usuario);
        this.auditService = new AuditService(appDataSource);
    }

    async create(loteId: string, data: CreateInspecaoDTO, usuarioId?: string) {
        const lote = await this.loteRepo.findOne({
            where: { id: loteId },
            relations: {
                inspecao: true
            }
        });

        if (!lote) {
            throw new AppError("Lote não encontrado", 404);
        }

        if (lote.inspecao) {
            throw new AppError("Este lote já possui inspeção registrada", 409);
        }

        const inspetor = await this.usuarioRepo.findOneBy({ id: data.inspetorId });

        if (!inspetor) {
            throw new AppError("Inspetor não encontrado", 404);
        }

        const inspecao = this.inspecaoRepo.create({
            lote,
            inspetor,
            resultado: data.resultado,
            quantidade_repr: data.quantidade_repr ?? 0,
            descricao_desvio: data.descricao_desvio ?? null
        });

        const inspecaoSalva = await this.inspecaoRepo.save(inspecao);

        lote.quantidade_repr = data.quantidade_repr ?? 0;
        lote.status = data.resultado;
        lote.encerrado_em = new Date();
        lote.inspecao = inspecaoSalva;

        await this.loteRepo.save(lote);

        await this.auditService.createLog({
            modulo: "inspecao",
            acao: "INSPECAO_REGISTRADA",
            descricao: `Inspeção registrada no lote ${lote.numero_lote}`,
            usuarioId: usuarioId ?? inspetor.id,
            detalhes: {
                loteId: lote.id,
                numero_lote: lote.numero_lote,
                inspecaoId: inspecaoSalva.id,
                resultado: inspecaoSalva.resultado,
                quantidade_repr: inspecaoSalva.quantidade_repr,
                descricao_desvio: inspecaoSalva.descricao_desvio
            }
        });

        const loteAtualizado = await this.loteRepo.findOne({
            where: { id: lote.id },
            relations: {
                produto: true,
                operador: true,
                insumos: true,
                inspecao: {
                    inspetor: true
                }
            }
        });

        return loteAtualizado;
    }

    async delete(loteId: string, usuarioId?: string) {
        const lote = await this.loteRepo.findOne({
            where: { id: loteId },
            relations: {
                inspecao: true,
                produto: true,
                operador: true,
                insumos: true
            }
        });

        if (!lote) {
            throw new AppError("Lote não encontrado", 404);
        }

        if (!lote.inspecao) {
            throw new AppError("Este lote não possui inspeção registrada", 404);
        }

        const inspecaoRemovida = {
            id: lote.inspecao.id,
            resultado: lote.inspecao.resultado,
            quantidade_repr: lote.inspecao.quantidade_repr,
            descricao_desvio: lote.inspecao.descricao_desvio
        };

        await this.inspecaoRepo.remove(lote.inspecao);

        lote.quantidade_repr = 0;
        lote.status = "aguardando_inspecao";
        lote.encerrado_em = null;
        lote.inspecao = null as any;

        await this.loteRepo.save(lote);

        await this.auditService.createLog({
            modulo: "inspecao",
            acao: "INSPECAO_EXCLUIDA",
            descricao: `Inspeção excluída do lote ${lote.numero_lote}`,
            usuarioId,
            detalhes: {
                loteId: lote.id,
                numero_lote: lote.numero_lote,
                inspecao: inspecaoRemovida
            }
        });

        const loteAtualizado = await this.loteRepo.findOne({
            where: { id: lote.id },
            relations: {
                produto: true,
                operador: true,
                insumos: true,
                inspecao: {
                    inspetor: true
                }
            }
        });

        return loteAtualizado;
    }
}
