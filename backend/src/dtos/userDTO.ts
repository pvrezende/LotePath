import { z } from "zod";
import { Perfil } from "../types/Perfil.js";

export const createUserDTOSchema = z.object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    perfil: z.nativeEnum(Perfil),
    ativo: z.boolean().optional()
});

export const updateUserDTOSchema = z.object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
    email: z.string().email("E-mail inválido").optional(),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
    perfil: z.nativeEnum(Perfil).optional(),
    ativo: z.boolean().optional()
});

export type CreateUserDTO = z.infer<typeof createUserDTOSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserDTOSchema>;
