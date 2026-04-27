import { z } from "zod";

export const createInsumoDTOSchema = z.object({
    nome_insumo: z
        .string()
        .trim()
        .min(1, "O nome do insumo é obrigatório"),

    codigo_insumo: z
        .string()
        .trim()
        .nullable()
        .optional(),

    lote_insumo: z
        .string()
        .trim()
        .nullable()
        .optional(),

    quantidade: z
        .number()
        .positive("A quantidade deve ser maior que zero"),

    unidade: z
        .string()
        .trim()
        .min(1, "A unidade é obrigatória")
});

export type CreateInsumoDTO = z.infer<typeof createInsumoDTOSchema>;