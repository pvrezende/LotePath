import { z } from "zod";
import { Perfil } from "../types/Perfil.js";

export const createUserDTOSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(3, "O nome deve ter no mínimo 3 caracteres")
        .max(100, "O nome deve ter no máximo 100 caracteres"),

    email: z
        .string()
        .trim()
        .email("Email inválido"),

    senha: z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres"),

    perfil: z.nativeEnum(Perfil, {
        errorMap: () => ({ message: "Perfil inválido" })
    })
});

export const updateUserDTOSchema = createUserDTOSchema
    .omit({ senha: true })
    .partial();

export type CreateUserDTO = z.infer<typeof createUserDTOSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserDTOSchema>;