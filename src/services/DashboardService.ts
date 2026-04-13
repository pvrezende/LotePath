import { DataSource, Repository } from "typeorm";
import { Lote } from "../entities/Lote.js";

export class DashboardService {
    private loteRepo: Repository<Lote>;

    constructor(appDataSource: DataSource) {
        this.loteRepo = appDataSource.getRepository(Lote);
    }

    async getDashboard() {
        const hoje = new Date();
        const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
            .toISOString()
            .split("T")[0];
        const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)
            .toISOString()
            .split("T")[0];

        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
            .toISOString()
            .split("T")[0];

        // Lotes produzidos hoje (COUNT)
        const lotesProduzidosHoje = await this.loteRepo
            .createQueryBuilder("lote")
            .where("lote.data_producao >= :inicioHoje", { inicioHoje })
            .andWhere("lote.data_producao < :fimHoje", { fimHoje })
            .getCount();

        // Unidades produzidas hoje (SUM)
        const unidadesResult = await this.loteRepo
            .createQueryBuilder("lote")
            .select("COALESCE(SUM(lote.quantidade_prod), 0)", "total")
            .where("lote.data_producao >= :inicioHoje", { inicioHoje })
            .andWhere("lote.data_producao < :fimHoje", { fimHoje })
            .getRawOne<{ total: string }>();
        const unidadesProduzidasHoje = Number(unidadesResult?.total ?? 0);

        // Lotes inspecionados no mês (COUNT)
        const totalInspecionadosMes = await this.loteRepo
            .createQueryBuilder("lote")
            .where("lote.data_producao >= :inicioMes", { inicioMes })
            .andWhere("lote.data_producao < :fimMes", { fimMes })
            .andWhere("lote.status IN (:...statusInspecionados)", {
                statusInspecionados: ["aprovado", "aprovado_restricao", "reprovado"],
            })
            .getCount();

        // Lotes aprovados no mês (inclui aprovado_restricao conforme PDF)
        const lotesAprovadosMes = await this.loteRepo
            .createQueryBuilder("lote")
            .where("lote.data_producao >= :inicioMes", { inicioMes })
            .andWhere("lote.data_producao < :fimMes", { fimMes })
            .andWhere("lote.status IN (:...statusAprovados)", {
                statusAprovados: ["aprovado", "aprovado_restricao"],
            })
            .getCount();

        const taxaAprovacaoMes =
            totalInspecionadosMes > 0
                ? Math.round((lotesAprovadosMes / totalInspecionadosMes) * 100)
                : 0;

        // Lotes aguardando inspeção (COUNT)
        const lotesAguardandoInspecao = await this.loteRepo
            .createQueryBuilder("lote")
            .where("lote.status = :status", { status: "aguardando_inspecao" })
            .getCount();

        // Últimos 10 lotes
        const ultimosLotesRaw = await this.loteRepo
            .createQueryBuilder("lote")
            .leftJoinAndSelect("lote.produto", "produto")
            .leftJoinAndSelect("lote.operador", "operador")
            .orderBy("lote.data_producao", "DESC")
            .addOrderBy("lote.aberto_em", "DESC")
            .take(10)
            .getMany();

        const ultimosLotes = ultimosLotesRaw.map((lote) => ({
            id: lote.id,
            numero_lote: lote.numero_lote,
            produto: lote.produto.nome,
            operador: lote.operador.nome,
            data_producao: new Date(lote.data_producao).toLocaleDateString("pt-BR"),
            status: lote.status,
        }));

        return {
            indicadores: {
                lotesProduzidosHoje,
                unidadesProduzidasHoje,
                taxaAprovacaoMes,
                lotesAguardandoInspecao,
            },
            ultimosLotes,
        };
    }
}
