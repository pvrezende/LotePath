import { DataSource, Repository } from "typeorm";
import { Lote } from "../entities/Lote.js";

export class DashboardService {
    private loteRepo: Repository<Lote>;

    constructor(appDataSource: DataSource) {
        this.loteRepo = appDataSource.getRepository(Lote);
    }

    private formatDate(dateValue: string | Date): string {
        const raw = String(dateValue).slice(0, 10);
        const [year, month, day] = raw.split("-");

        if (!year || !month || !day) {
            return String(dateValue);
        }

        return `${day}/${month}/${year}`;
    }

    private isSameDay(dateValue: string | Date, reference: Date): boolean {
        const raw = String(dateValue).slice(0, 10);
        const [year, month, day] = raw.split("-").map(Number);

        if (!year || !month || !day) {
            return false;
        }

        return (
            year === reference.getFullYear() &&
            month === reference.getMonth() + 1 &&
            day === reference.getDate()
        );
    }

    private isSameMonth(dateValue: string | Date, reference: Date): boolean {
        const raw = String(dateValue).slice(0, 10);
        const [year, month] = raw.split("-").map(Number);

        if (!year || !month) {
            return false;
        }

        return (
            year === reference.getFullYear() &&
            month === reference.getMonth() + 1
        );
    }

    async getDashboard() {
        const hoje = new Date();

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

        const lotesHoje = lotes.filter((lote) =>
            this.isSameDay(lote.data_producao, hoje)
        );

        const lotesMesInspecionados = lotes.filter((lote) => {
            const statusInspecionados = ["aprovado", "aprovado_restricao", "reprovado"];
            return (
                this.isSameMonth(lote.data_producao, hoje) &&
                statusInspecionados.includes(lote.status)
            );
        });

        const lotesAprovadosMes = lotesMesInspecionados.filter(
            (lote) =>
                lote.status === "aprovado" ||
                lote.status === "aprovado_restricao"
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
            data_producao: this.formatDate(lote.data_producao),
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