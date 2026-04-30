import { DataSource, Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { Usuario } from "../entities/Usuario.js";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/userDTO.js";
import { AppError } from "../errors/AppError.js";
import { Lote } from "../entities/Lote.js";
import { InspecaoLote } from "../entities/Inspecao_lote.js";

export class UsuarioService {
    private usuarioRepo: Repository<Usuario>;
    private loteRepo: Repository<Lote>;
    private inspecaoRepo: Repository<InspecaoLote>;

    constructor(appDataSource: DataSource) {
        this.usuarioRepo = appDataSource.getRepository(Usuario);
        this.loteRepo = appDataSource.getRepository(Lote);
        this.inspecaoRepo = appDataSource.getRepository(InspecaoLote);
    }

    private removeSenha(usuario: Usuario) {
        const { senha, ...usuarioSemSenha } = usuario as any;
        return usuarioSemSenha;
    }

    async getAll() {
        const usuarios = await this.usuarioRepo.find({
            order: {
                criado_em: "ASC"
            }
        });

        return usuarios.map((usuario) => this.removeSenha(usuario));
    }

    async getById(id: string) {
        const usuario = await this.usuarioRepo.findOneBy({ id });

        if (!usuario) {
            throw new AppError("Usuário não encontrado", 404);
        }

        return this.removeSenha(usuario);
    }

    async createUser(data: CreateUserDTO) {
        const emailExists = await this.usuarioRepo.findOneBy({
            email: data.email
        });

        if (emailExists) {
            throw new AppError("Já existe um usuário com este e-mail", 409);
        }

        const senhaHash = await bcrypt.hash(data.senha, 8);

        const usuario = this.usuarioRepo.create({
            nome: data.nome,
            email: data.email,
            senha: senhaHash,
            perfil: data.perfil,
            ativo: data.ativo ?? true
        });

        const usuarioSalvo = await this.usuarioRepo.save(usuario);

        return this.removeSenha(usuarioSalvo);
    }

    async updateUser(id: string, data: UpdateUserDTO) {
        const usuario = await this.usuarioRepo.findOneBy({ id });

        if (!usuario) {
            throw new AppError("Usuário não encontrado", 404);
        }

        if (data.email && data.email !== usuario.email) {
            const emailExists = await this.usuarioRepo.findOneBy({
                email: data.email
            });

            if (emailExists) {
                throw new AppError("Já existe um usuário com este e-mail", 409);
            }

            usuario.email = data.email;
        }

        if (data.nome) {
            usuario.nome = data.nome;
        }

        if (data.perfil) {
            usuario.perfil = data.perfil;
        }

        if (typeof data.ativo === "boolean") {
            usuario.ativo = data.ativo;
        }

        if (data.senha) {
            usuario.senha = await bcrypt.hash(data.senha, 8);
        }

        const usuarioAtualizado = await this.usuarioRepo.save(usuario);

        return this.removeSenha(usuarioAtualizado);
    }

    async deleteUser(id: string) {
        const usuario = await this.usuarioRepo.findOneBy({ id });

        if (!usuario) {
            throw new AppError("Usuário não encontrado", 404);
        }

        const lotesVinculados = await this.loteRepo.count({
            where: {
                operador: {
                    id
                }
            }
        });

        const inspecoesVinculadas = await this.inspecaoRepo.count({
            where: {
                inspetor: {
                    id
                }
            }
        });

        if (lotesVinculados > 0 || inspecoesVinculadas > 0) {
            throw new AppError(
                "Não é possível excluir este usuário porque ele possui histórico vinculado a lotes ou inspeções. Use a opção de desativar usuário.",
                409
            );
        }

        await this.usuarioRepo.remove(usuario);

        return {
            message: "Usuário excluído com sucesso"
        };
    }
}
