import { DataSource, Repository } from "typeorm";
import { InspecaoLote } from "../entities/Inspecao_lote.js";
import { Lote } from "../entities/Lote.js";
import { Usuario } from "../entities/Usuario.js";
import { CreateInspecaoDTO } from "../dtos/InspecaoDTO.js";
import { AppError } from "../errors/AppError.js";

export class InspecaoService {
    private inspecaoRepo: Repository<InspecaoLote>;
    private loteRepo: Repository<Lote>;
    private usuarioRepo: Repository<Usuario>;

    constructor(appDataSource: DataSource) {
        this.inspecaoRepo = appDataSource.getRepository(InspecaoLote);
        this.loteRepo = appDataSource.getRepository(Lote);
        this.usuarioRepo = appDataSource.getRepository(Usuario);
    }

    async create(loteId: string, data: CreateInspecaoDTO) {
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
            resultado: data.resultado,
            quantidade_repr: data.quantidade_repr ?? 0,
            descricao_desvio: data.descricao_desvio ?? null,
            lote: { id: lote.id } as Lote,
            inspetor: { id: inspetor.id } as Usuario
        });

        const inspecaoSalva = await this.inspecaoRepo.save(inspecao);

        lote.quantidade_repr = data.quantidade_repr ?? 0;
        lote.status = data.resultado;
        lote.encerrado_em = new Date();

        await this.loteRepo.save(lote);

        const inspecaoCompleta = await this.inspecaoRepo.findOne({
            where: { id: inspecaoSalva.id },
            relations: {
                lote: true,
                inspetor: true
            }
        });

        return inspecaoCompleta;
    }
}