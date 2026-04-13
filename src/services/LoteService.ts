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

    private static readonly VALID_STATUS = [
        "em_producao",
        "aguardando_inspecao",
        "aprovado",
        "aprovado_restricao",
        "reprovado",
    ] as const;

    async getAllWithFilters(
        filters: {
          produto_id?: string;
          status?: string;
          data_inicio?: string;
          data_fim?: string;
        },
        page: number = 1,
        limit: number = 20
    ) {
        if (filters.status && !(LoteService.VALID_STATUS as readonly string[]).includes(filters.status)) {
            throw new AppError(
                `Status inválido. Valores permitidos: ${LoteService.VALID_STATUS.join(", ")}`,
                400
            );
        }

        const query = this.loteRepo
          .createQueryBuilder("lote")
          .leftJoinAndSelect("lote.produto", "produto")
          .leftJoinAndSelect("lote.operador", "operador")
          .leftJoinAndSelect("lote.inspecao", "inspecao");

        if (filters.produto_id) {
          query.andWhere("produto.id = :produto_id", { produto_id: filters.produto_id });
        }
        if (filters.status) {
          query.andWhere("lote.status = :status", { status: filters.status });
        }
        if (filters.data_inicio) {
          query.andWhere("lote.data_producao >= :data_inicio", { data_inicio: filters.data_inicio });
        }
        if (filters.data_fim) {
          query.andWhere("lote.data_producao <= :data_fim", { data_fim: filters.data_fim });
        }
    
        const [lotes, total] = await query
          .orderBy("lote.data_producao", "DESC")
          .addOrderBy("lote.aberto_em", "DESC")
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();
    
        return { lotes, total, page, limit };
  }
}
