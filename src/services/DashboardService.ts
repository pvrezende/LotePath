import { DataSource, Repository } from "typeorm";
import { Lote } from "../entities/Lote.js";

export class DashboardService {
    private loteRepo: Repository<Lote>;

    constructor(appDataSource: DataSource) {
        this.loteRepo = appDataSource.getRepository(Lote);
    }

    private static toLocalDateString(date: Date): string {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    async getDashboard() {
        const hoje = new Date();
        const inicioHoje = DashboardService.toLocalDateString(
            new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
        );
        const fimHoje = DashboardService.toLocalDateString(
            new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)
        );

        const inicioMes = DashboardService.toLocalDateString(
            new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        );
        const fimMes = DashboardService.toLocalDateString(
            new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
        );

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
        const unidadesProduzidasHoje = parseInt(unidadesResult?.total ?? "0", 10) || 0;

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
