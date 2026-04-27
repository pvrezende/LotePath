import { z } from "zod";

export const createLoteDTOSchema = z.object({
    produtoId: z
        .string()
        .uuid("Produto inválido"),

    data_producao: z
        .string()
        .min(1, "A data de produção é obrigatória"),

    turno: z.enum(["manha", "tarde", "noite"], {
        message: "Turno inválido"
    }),

    operadorId: z
        .string()
        .uuid("Operador inválido"),

    quantidade_prod: z
        .number()
        .int("A quantidade deve ser um número inteiro")
        .positive("A quantidade deve ser maior que zero"),

    observacoes: z
        .string()
        .trim()
        .nullable()
        .optional()
});

export const updateStatusLoteDTOSchema = z.object({
    status: z.enum(
        ["em_producao", "aguardando_inspecao", "aprovado", "aprovado_restricao", "reprovado"],
        { message: "Status inválido" }
    )
});

export type CreateLoteDTO = z.infer<typeof createLoteDTOSchema>;
export type UpdateStatusLoteDTO = z.infer<typeof updateStatusLoteDTOSchema>;