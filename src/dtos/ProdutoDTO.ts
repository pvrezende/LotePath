import {z} from "zod";

export const createProdutoDTOSchema = z.object({
    codigo: z.string().trim().min(1, "O código do produto é obrigatório"),
    nome: z.string().trim().min(1, "O nome do produto é obrigatório"),
    descricao: z.string().trim().optional(),
    linha: z.string().trim().min(1, "A linha do produto é obrigatória"),
    ativo: z.boolean().default(true)
});

export type CreateProdutoDTO = z.infer<typeof createProdutoDTOSchema>;