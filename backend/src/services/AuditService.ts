import { DataSource, Repository } from "typeorm";
import { AuditLog } from "../entities/AuditLog.js";
import { Usuario } from "../entities/Usuario.js";

type CreateAuditLogParams = {
    modulo: string;
    acao: string;
    descricao: string;
    usuarioId?: string | null;
    detalhes?: Record<string, unknown> | null;
};

export class AuditService {
    private auditRepo: Repository<AuditLog>;
    private usuarioRepo: Repository<Usuario>;

    constructor(appDataSource: DataSource) {
        this.auditRepo = appDataSource.getRepository(AuditLog);
        this.usuarioRepo = appDataSource.getRepository(Usuario);
    }

    async createLog(params: CreateAuditLogParams) {
        let usuario: Usuario | null = null;

        if (params.usuarioId) {
            usuario = await this.usuarioRepo.findOneBy({ id: params.usuarioId });
        }

        const log = this.auditRepo.create({
            modulo: params.modulo,
            acao: params.acao,
            descricao: params.descricao,
            usuario_id: usuario?.id ?? params.usuarioId ?? null,
            usuario_nome: usuario?.nome ?? null,
            usuario_perfil: usuario?.perfil ?? null,
            detalhes: params.detalhes ?? null
        });

        return this.auditRepo.save(log);
    }

    async getLogs(modulo?: string) {
        return this.auditRepo.find({
            where: modulo ? { modulo } : {},
            order: {
                criado_em: "DESC"
            },
            take: 100
        });
    }
}
