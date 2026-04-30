import { DataSource, Repository } from "typeorm";
import { Lote } from "../entities/Lote.js";
import { AppError } from "../errors/AppError.js";

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

    private normalizeDate(dateParam?: string): Date {
        if (!dateParam) {
            return new Date();
        }

        const [year, month, day] = dateParam.split("-").map(Number);

        if (!year || !month || !day) {
            return new Date();
        }

        return new Date(year, month - 1, day);
    }

    private parseDateParts(dateValue: string | Date) {
        const raw = String(dateValue).slice(0, 10);
        const [year, month, day] = raw.split("-").map(Number);

        if (!year || !month || !day) {
            return null;
        }

        return { year, month, day };
    }

    private isBetweenDates(
        dateValue: string | Date,
        startDate: Date,
        endDate: Date
    ): boolean {
        const parts = this.parseDateParts(dateValue);

        if (!parts) {
            return false;
        }

        const current = new Date(parts.year, parts.month - 1, parts.day);
        const normalizedStart = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );
        const normalizedEnd = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        );

        return current >= normalizedStart && current <= normalizedEnd;
    }

    private formatISODate(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
    }

    async getDashboard(dataInicial?: string, dataFinal?: string) {
        const startDate = this.normalizeDate(dataInicial);
        const endDate = this.normalizeDate(dataFinal ?? dataInicial);

        if (startDate > endDate) {
            throw new AppError("A data inicial não pode ser maior que a data final.", 400);
        }

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

        const lotesDoPeriodo = lotes.filter((lote) =>
            this.isBetweenDates(lote.data_producao, startDate, endDate)
        );

        const statusInspecionados = [
            "aprovado",
            "aprovado_restricao",
            "reprovado",
        ];

        const lotesInspecionadosNoPeriodo = lotesDoPeriodo.filter((lote) =>
            statusInspecionados.includes(lote.status)
        );

        const lotesAprovadosNoPeriodo = lotesInspecionadosNoPeriodo.filter(
            (lote) =>
                lote.status === "aprovado" ||
                lote.status === "aprovado_restricao"
        ).length;

        const taxaAprovacaoPeriodo =
            lotesInspecionadosNoPeriodo.length > 0
                ? Math.round(
                      (lotesAprovadosNoPeriodo /
                          lotesInspecionadosNoPeriodo.length) *
                          100
                  )
                : 0;

        const lotesPendentesNoPeriodo = lotesDoPeriodo.filter(
            (lote) =>
                lote.status === "em_producao" ||
                lote.status === "aguardando_inspecao"
        ).length;

        const lotesDoPeriodoFormatados = lotesDoPeriodo.map((lote) => ({
            id: lote.id,
            numero_lote: lote.numero_lote,
            produto: lote.produto.nome,
            operador: lote.operador.nome,
            data_producao: this.formatDate(lote.data_producao),
            status: lote.status,
        }));

        return {
            periodo: {
                dataInicial: this.formatISODate(startDate),
                dataFinal: this.formatISODate(endDate),
            },
            indicadores: {
                lotesProduzidosHoje: lotesDoPeriodo.length,
                unidadesProduzidasHoje: lotesDoPeriodo.reduce(
                    (acc, lote) => acc + lote.quantidade_prod,
                    0
                ),
                taxaAprovacaoMes: taxaAprovacaoPeriodo,
                lotesAguardandoInspecao: lotesPendentesNoPeriodo,
            },
            ultimosLotes: lotesDoPeriodoFormatados,
        };
    }
}
