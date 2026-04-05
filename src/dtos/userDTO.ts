import { z } from "zod";
import { Perfil } from '../types/Perfil.js';


export const createUserDTOSchema = z.object({
    nome: z.string().trim().min(3).max(100, "O nome deve ter entre 3 e 100 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string()
        .min(6)
        .refine(s => /[A-Za-z0-9]/.test(s), "A senha deve conter no mínimo 6 caracteres"),
    perfil: z.enum(Perfil)

});

export const updateUserDTOSchema = createUserDTOSchema
    .omit({ senha: true })
    .partial()


export type CreateUserDTO = z.infer<typeof createUserDTOSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserDTOSchema>;
