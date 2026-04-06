import { z } from "zod";

export const loginDTOSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Email inválido"),

    senha: z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
});

export type LoginDTO = z.infer<typeof loginDTOSchema>;