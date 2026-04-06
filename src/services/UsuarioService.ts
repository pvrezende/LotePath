import bcrypt from "bcryptjs";
import { DataSource, Repository } from "typeorm";
import { Usuario } from "../entities/Usuario.js";
import { createUserDTOSchema } from "../dtos/userDTO.js";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";

type CreateUserDTO = z.infer<typeof createUserDTOSchema>;

export class UsuarioService {
    private userRepo: Repository<Usuario>;

    constructor(appDataSource: DataSource) {
        this.userRepo = appDataSource.getRepository(Usuario);
    }

    async getAll() {
        return this.userRepo.find();
    }

    async getById(id: string) {
        const user = await this.userRepo.findOneBy({ id });

        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        return user;
    }

    async getByEmail(email: string) {
        return this.userRepo.findOne({
            where: { email },
            select: ["id", "nome", "email", "senha", "perfil", "criado_em"]
        });
    }

    async createUser(data: CreateUserDTO) {
        const usuarioExistente = await this.getByEmail(data.email);

        if (usuarioExistente) {
            throw new AppError("Email já existe", 409);
        }

        const senhaHash = await bcrypt.hash(data.senha, 10);

        const novoUsuario = this.userRepo.create({
            ...data,
            senha: senhaHash
        });

        await this.userRepo.save(novoUsuario);

        return novoUsuario;
    }

    async updateUser(id: string, data: Partial<Usuario>) {
        const usuario = await this.getById(id);

        if (data.email && data.email !== usuario.email) {
            const emailExistente = await this.getByEmail(data.email);

            if (emailExistente) {
                throw new AppError("Email já existe", 409);
            }
        }

        if (data.nome !== undefined) {
            usuario.nome = data.nome;
        }

        if (data.email !== undefined) {
            usuario.email = data.email;
        }

        if (data.senha !== undefined) {
            usuario.senha = await bcrypt.hash(data.senha, 10);
        }

        await this.userRepo.save(usuario);

        return usuario;
    }
}