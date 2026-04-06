import { DataSource, Repository } from "typeorm";
import { Lote } from "../entities/Lote.js";
import { Produto } from "../entities/Produto.js";
import { Usuario } from "../entities/Usuario.js";
import { CreateLoteDTO, UpdateStatusLoteDTO } from "../dtos/LoteDTO.js";
import { AppError } from "../errors/AppError.js";

export class LoteService {
    private loteRepo: Repository<Lote>;
    private produtoRepo: Repository<Produto>;
    private usuarioRepo: Repository<Usuario>;

    constructor(appDataSource: DataSource) {
        this.loteRepo = appDataSource.getRepository(Lote);
        this.produtoRepo = appDataSource.getRepository(Produto);
        this.usuarioRepo = appDataSource.getRepository(Usuario);
    }

    private async gerarNumeroLote() {
        const ano = new Date().getFullYear();

        const ultimoLote = await this.loteRepo.findOne({
            where: {},
            order: { numero_lote: "DESC" }
        });

        let sequencia = 1;

        if (ultimoLote?.numero_lote) {
            const partes = ultimoLote.numero_lote.split("-");
            const ultimoNumero = Number(partes[2]);

            if (!Number.isNaN(ultimoNumero)) {
                sequencia = ultimoNumero + 1;
            }
        }

        return `LOT-${ano}-${String(sequencia).padStart(5, "0")}`;
    }

    async create(data: CreateLoteDTO) {
        const produto = await this.produtoRepo.findOneBy({ id: data.produtoId });

        if (!produto) {
            throw new AppError("Produto não encontrado", 404);
        }

        if (!produto.ativo) {
            throw new AppError("Produto inativo não pode gerar lote", 400);
        }

        const operador = await this.usuarioRepo.findOneBy({ id: data.operadorId });

        if (!operador) {
            throw new AppError("Operador não encontrado", 404);
        }

        const numero_lote = await this.gerarNumeroLote();

        const lote = this.loteRepo.create({
            numero_lote,
            produto,
            data_producao: new Date(data.data_producao),
            turno: data.turno,
            operador,
            quantidade_prod: data.quantidade_prod,
            quantidade_repr: 0,
            status: "em_producao",
            observacoes: data.observacoes ?? null,
            encerrado_em: null
        });

        await this.loteRepo.save(lote);

        return lote;
    }

    async getAll() {
        return this.loteRepo.find({
            relations: {
                produto: true,
                operador: true,
                inspecao: true,
                insumos: true
            },
            order: {
                data_producao: "DESC"
            }
        });
    }

    async getById(id: string) {
        const lote = await this.loteRepo.findOne({
            where: { id },
            relations: {
                produto: true,
                operador: true,
                inspecao: true,
                insumos: true
            }
        });

        if (!lote) {
            throw new AppError("Lote não encontrado", 404);
        }

        return lote;
    }

    async updateStatus(id: string, data: UpdateStatusLoteDTO) {
        const lote = await this.getById(id);

        lote.status = data.status;

        if (data.status === "aguardando_inspecao") {
            lote.encerrado_em = new Date();
        }

        await this.loteRepo.save(lote);

        return lote;
    }
}