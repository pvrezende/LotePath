import { DataSource, Repository } from "typeorm";
import PDFDocument from "pdfkit";
import { Produto } from "../entities/Produto.js";
import { Usuario } from "../entities/Usuario.js";
import { Lote } from "../entities/Lote.js";
import { CreateLoteDTO, UpdateLoteDTO, UpdateStatusLoteDTO } from "../dtos/LoteDTO.js";
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

    private async gerarNumeroLote(): Promise<string> {
        const ano = new Date().getFullYear();

        const count = await this.loteRepo.count();
        const sequencial = String(count + 1).padStart(5, "0");

        return `LOT-${ano}-${sequencial}`;
    }

    private formatDate(dateValue?: string | Date | null): string {
        if (!dateValue) {
            return "-";
        }

        const raw = String(dateValue).slice(0, 10);
        const [year, month, day] = raw.split("-");

        if (!year || !month || !day) {
            return String(dateValue);
        }

        return `${day}/${month}/${year}`;
    }

    private formatDateTime(dateValue?: string | Date | null): string {
        if (!dateValue) {
            return "-";
        }

        return new Date(dateValue).toLocaleString("pt-BR");
    }

    private formatStatus(status: string): string {
        const labels: Record<string, string> = {
            em_producao: "Em produção",
            aguardando_inspecao: "Aguardando inspeção",
            aprovado: "Aprovado",
            aprovado_restricao: "Aprovado com restrição",
            reprovado: "Reprovado"
        };

        return labels[status] ?? status;
    }

    private formatTurno(turno: string): string {
        const labels: Record<string, string> = {
            manha: "Manhã",
            tarde: "Tarde",
            noite: "Noite"
        };

        return labels[turno] ?? turno;
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
            data_producao: data.data_producao as any,
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
                inspecao: {
                    inspetor: true
                },
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
                inspecao: {
                    inspetor: true
                },
                insumos: true
            }
        });

        if (!lote) {
            throw new AppError("Lote não encontrado", 404);
        }

        return lote;
    }

    async update(id: string, data: UpdateLoteDTO) {
        const lote = await this.getById(id);

        const produto = await this.produtoRepo.findOneBy({ id: data.produtoId });

        if (!produto) {
            throw new AppError("Produto não encontrado", 404);
        }

        if (!produto.ativo) {
            throw new AppError("Produto inativo não pode ser usado no lote", 400);
        }

        lote.produto = produto;
        lote.data_producao = data.data_producao as any;
        lote.turno = data.turno;
        lote.quantidade_prod = data.quantidade_prod;
        lote.observacoes = data.observacoes ?? null;

        await this.loteRepo.save(lote);

        return this.getById(id);
    }

    async delete(id: string) {
        const lote = await this.getById(id);

        await this.loteRepo.remove(lote);
    }

    async updateStatus(id: string, data: UpdateStatusLoteDTO) {
        const lote = await this.getById(id);

        lote.status = data.status;

        if (data.status === "aguardando_inspecao") {
            lote.encerrado_em = new Date();
        }

        await this.loteRepo.save(lote);

        return this.getById(id);
    }

    async generatePdfReport(id: string): Promise<Buffer> {
        const lote = await this.getById(id);

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: "A4",
                margin: 44,
                bufferPages: true
            });

            const chunks: Buffer[] = [];

            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            const pageWidth = doc.page.width;
            const contentWidth = pageWidth - 88;

            const drawSectionTitle = (title: string) => {
                doc.moveDown(1.1);
                doc
                    .fillColor("#0f172a")
                    .fontSize(15)
                    .font("Helvetica-Bold")
                    .text(title);
                doc
                    .moveTo(44, doc.y + 6)
                    .lineTo(pageWidth - 44, doc.y + 6)
                    .strokeColor("#dbeafe")
                    .lineWidth(1)
                    .stroke();
                doc.moveDown(0.7);
            };

            const drawInfoRow = (label: string, value: string) => {
                const startY = doc.y;
                doc
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .fillColor("#475569")
                    .text(label, 44, startY, { width: 155 });

                doc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor("#0f172a")
                    .text(value || "-", 205, startY, { width: contentWidth - 161 });

                doc.moveDown(0.45);
            };

            const drawBadge = (text: string) => {
                const x = pageWidth - 210;
                const y = 52;
                doc
                    .roundedRect(x, y, 166, 32, 12)
                    .fillAndStroke("#eff6ff", "#bfdbfe");
                doc
                    .fillColor("#1d4ed8")
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .text(text, x, y + 10, { width: 166, align: "center" });
            };

            // Header
            doc.rect(0, 0, pageWidth, 118).fill("#0f172a");
            doc
                .fillColor("#ffffff")
                .font("Helvetica-Bold")
                .fontSize(25)
                .text("LotePath", 44, 36);
            doc
                .font("Helvetica")
                .fontSize(11)
                .fillColor("#cbd5e1")
                .text("Relatório profissional de rastreabilidade por lote", 44, 67);
            drawBadge(this.formatStatus(lote.status));

            doc.y = 142;

            doc
                .fillColor("#0f172a")
                .font("Helvetica-Bold")
                .fontSize(18)
                .text(`Relatório do lote ${lote.numero_lote}`, 44, doc.y);

            doc
                .fillColor("#64748b")
                .font("Helvetica")
                .fontSize(10)
                .text(`Gerado em ${this.formatDateTime(new Date())}`, 44, doc.y + 4);

            drawSectionTitle("1. Identificação do lote");
            drawInfoRow("Número do lote", lote.numero_lote);
            drawInfoRow("Produto", `${lote.produto.codigo} - ${lote.produto.nome}`);
            drawInfoRow("Linha", lote.produto.linha);
            drawInfoRow("Operador", lote.operador.nome);
            drawInfoRow("Data de produção", this.formatDate(lote.data_producao));
            drawInfoRow("Turno", this.formatTurno(lote.turno));
            drawInfoRow("Quantidade produzida", String(lote.quantidade_prod));
            drawInfoRow("Quantidade reprovada", String(lote.quantidade_repr ?? 0));
            drawInfoRow("Status", this.formatStatus(lote.status));
            drawInfoRow("Observações", lote.observacoes || "Nenhuma observação registrada.");

            drawSectionTitle("2. Insumos utilizados");

            if (lote.insumos?.length) {
                doc
                    .roundedRect(44, doc.y, contentWidth, 26, 8)
                    .fill("#f1f5f9");

                const headerY = doc.y + 8;
                doc.fillColor("#334155").font("Helvetica-Bold").fontSize(8);
                doc.text("INSUMO", 54, headerY, { width: 145 });
                doc.text("CÓDIGO", 205, headerY, { width: 90 });
                doc.text("LOTE INSUMO", 305, headerY, { width: 110 });
                doc.text("QTD.", 425, headerY, { width: 50 });
                doc.text("UN.", 485, headerY, { width: 50 });
                doc.y += 32;

                for (const insumo of lote.insumos) {
                    if (doc.y > 720) {
                        doc.addPage();
                    }

                    const rowY = doc.y;
                    doc.fillColor("#0f172a").font("Helvetica").fontSize(8.5);
                    doc.text(insumo.nome_insumo, 54, rowY, { width: 145 });
                    doc.text(insumo.codigo_insumo || "-", 205, rowY, { width: 90 });
                    doc.text(insumo.lote_insumo || "-", 305, rowY, { width: 110 });
                    doc.text(String(insumo.quantidade), 425, rowY, { width: 50 });
                    doc.text(insumo.unidade, 485, rowY, { width: 50 });

                    doc
                        .moveTo(44, rowY + 18)
                        .lineTo(pageWidth - 44, rowY + 18)
                        .strokeColor("#e5e7eb")
                        .lineWidth(0.6)
                        .stroke();

                    doc.y = rowY + 24;
                }
            } else {
                doc
                    .fillColor("#64748b")
                    .font("Helvetica")
                    .fontSize(10)
                    .text("Nenhum insumo vinculado a este lote.");
            }

            drawSectionTitle("3. Inspeção de qualidade");

            if (lote.inspecao) {
                drawInfoRow("Resultado", this.formatStatus(lote.inspecao.resultado));
                drawInfoRow("Inspetor", lote.inspecao.inspetor?.nome || "-");
                drawInfoRow("Quantidade reprovada", String(lote.inspecao.quantidade_repr ?? 0));
                drawInfoRow("Desvio", lote.inspecao.descricao_desvio || "Nenhum desvio informado.");
                drawInfoRow("Inspecionado em", this.formatDateTime(lote.inspecao.inspecionado_em));
            } else {
                doc
                    .fillColor("#64748b")
                    .font("Helvetica")
                    .fontSize(10)
                    .text("Este lote ainda não possui inspeção registrada.");
            }

            drawSectionTitle("4. Linha do tempo resumida");

            const timeline = [
                {
                    title: "Lote aberto",
                    description: `Lote criado para ${lote.produto.nome}.`,
                    date: lote.aberto_em
                },
                ...(lote.insumos || []).map((insumo) => ({
                    title: "Insumo vinculado",
                    description: `${insumo.nome_insumo} | Código: ${insumo.codigo_insumo || "-"} | Lote: ${insumo.lote_insumo || "-"}`,
                    date: lote.aberto_em
                })),
                ...(lote.inspecao
                    ? [
                          {
                              title: "Inspeção registrada",
                              description: `Resultado: ${this.formatStatus(lote.inspecao.resultado)}.`,
                              date: lote.inspecao.inspecionado_em
                          }
                      ]
                    : []),
                {
                    title: "Status atual",
                    description: this.formatStatus(lote.status),
                    date: lote.encerrado_em || lote.inspecao?.inspecionado_em || lote.aberto_em
                }
            ];

            for (const event of timeline) {
                if (doc.y > 720) {
                    doc.addPage();
                }

                const y = doc.y;
                doc
                    .circle(50, y + 7, 4)
                    .fill("#2563eb");

                doc
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .fillColor("#0f172a")
                    .text(event.title, 64, y, { width: 230 });

                doc
                    .font("Helvetica")
                    .fontSize(8.5)
                    .fillColor("#64748b")
                    .text(this.formatDateTime(event.date), 380, y, {
                        width: 160,
                        align: "right"
                    });

                doc
                    .font("Helvetica")
                    .fontSize(9)
                    .fillColor("#334155")
                    .text(event.description, 64, y + 15, { width: contentWidth - 20 });

                doc.y = y + 42;
            }

            // Footer pages
            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);
                doc
                    .font("Helvetica")
                    .fontSize(8)
                    .fillColor("#94a3b8")
                    .text(
                        `LotePath • Relatório de rastreabilidade • Página ${i + 1} de ${range.count}`,
                        44,
                        doc.page.height - 34,
                        { align: "center", width: contentWidth }
                    );
            }

            doc.end();
        });
    }
}
