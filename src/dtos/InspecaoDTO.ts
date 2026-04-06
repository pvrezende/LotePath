import { z } from "zod";

export const createInspecaoDTOSchema = z.object({
    inspetorId: z
        .string()
        .uuid("Inspetor inválido"),

    resultado: z.enum(["aprovado", "aprovado_restricao", "reprovado"], {
        message: "Resultado inválido"
    }),

    quantidade_repr: z
        .number()
        .int("A quantidade reprovada deve ser inteira")
        .min(0, "A quantidade reprovada não pode ser negativa")
        .default(0),

    descricao_desvio: z
        .string()
        .trim()
        .nullable()
        .optional()
}).superRefine((data, ctx) => {
    if (data.resultado !== "aprovado" && !data.descricao_desvio) {
        ctx.addIssue({
            code: "custom",
            path: ["descricao_desvio"],
            message: "A descrição do desvio é obrigatória quando o resultado não é aprovado"
        });
    }
});

export type CreateInspecaoDTO = z.infer<typeof createInspecaoDTOSchema>;