import bcrypt from "bcryptjs";
import { Repository, DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { createUserDTOSchema } from "../dtos/userDTO.js";

export class UsuarioService {

    private userRepo: Repository<Usuario>;

    constructor(appDataSource: DataSource) {
        this.userRepo = appDataSource.getRepository(Usuario);
    }

    async getAll() {
        return this.userRepo.find();
    }

    async getById(id_user: string) {
        const user = await this.userRepo.findOneBy({ id_user });
        if (!user) {
            throw new Error('Usuario não encontrado');
        }
        return user;
    }

    async getEmail(email: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
            throw new Error('Email não encontrado');
        }
        return user.email;
    }

    async createUser(data: createUserDTOSchema) {
        const usuario = await this.getEmail(data.email);
        if (usuario) {
            throw new Error('Email já existe');
        }
        data.senha = await bcrypt.hash(data.senha, 2);
        const novoUsuario = await this.userRepo.create(data);
        await this.userRepo.save(novoUsuario);
        return novoUsuario;

    }

    async updateUser(id: string, data: Partial<Usuario>) {
        if (data.nome !== undefined) {
            const usuario = await this.getById(id);
            usuario.nome = data.nome;
            await this.userRepo.save(usuario);
        }
        if (data.email !== undefined) {
            const usuario = await this.getById(id);
            usuario.email = data.email;
            await this.userRepo.save(usuario);
        }
        if (data.senha !== undefined) {
            const usuario = await this.getById(id);
            usuario.senha = await bcrypt.hash(data.senha, 2);
            await this.userRepo.save(usuario);
        }

    }

}