import { DataSource, Repository } from "typeorm";
import { Lote } from "../entities/Lote.js";

export class DashboardService {
    private loteRepo: Repository<Lote>;

    constructor(appDataSource: DataSource) {
        this.loteRepo = appDataSource.getRepository(Lote);
    }

    async getDashboard() {
        const hoje = new Date();
        const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);

        const lotes = await this.loteRepo.find({
            relations: {
                produto: true,
                operador: true,
            },
            order: {
                data_producao: "DESC",
                aberto_em: "DESC",
            },
        });

        const lotesHoje = lotes.filter((lote) => {
            const data = new Date(lote.data_producao);
            return data >= inicioHoje && data < fimHoje;
        });

        const lotesMesInspecionados = lotes.filter((lote) => {
            const data = new Date(lote.data_producao);
            const statusInspecionados = ["aprovado", "aprovado_restricao", "reprovado"];
            return data >= inicioMes && data < fimMes && statusInspecionados.includes(lote.status);
        });

        const lotesAprovadosMes = lotesMesInspecionados.filter(
            (lote) => lote.status === "aprovado" || lote.status === "aprovado_restricao"
        ).length;

        const taxaAprovacaoMes =
            lotesMesInspecionados.length > 0
                ? Math.round((lotesAprovadosMes / lotesMesInspecionados.length) * 100)
                : 0;

        const ultimosLotes = lotes.slice(0, 10).map((lote) => ({
            id: lote.id,
            numero_lote: lote.numero_lote,
            produto: lote.produto.nome,
            operador: lote.operador.nome,
            data_producao: new Date(lote.data_producao).toLocaleDateString("pt-BR"),
            status: lote.status,
        }));

        return {
            indicadores: {
                lotesProduzidosHoje: lotesHoje.length,
                unidadesProduzidasHoje: lotesHoje.reduce(
                    (acc, lote) => acc + lote.quantidade_prod,
                    0
                ),
                taxaAprovacaoMes,
                lotesAguardandoInspecao: lotes.filter(
                    (lote) => lote.status === "aguardando_inspecao"
                ).length,
            },
            ultimosLotes,
        };
    }
}
