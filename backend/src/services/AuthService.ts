import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DataSource, Repository } from "typeorm";
import { Usuario } from "../entities/Usuario.js";
import { LoginDTO } from "../dtos/authDTO.js";
import { AppError } from "../errors/AppError.js";

export class AuthService {
    private usuarioRepo: Repository<Usuario>;

    constructor(appDataSource: DataSource) {
        this.usuarioRepo = appDataSource.getRepository(Usuario);
    }

    async login(data: LoginDTO) {
        const usuario = await this.usuarioRepo.findOne({
            where: { email: data.email },
            select: ["id", "nome", "email", "senha", "perfil"]
        });

        if (!usuario) {
            throw new AppError("Email ou senha inválidos", 401);
        }

        const senhaCorreta = await bcrypt.compare(data.senha, usuario.senha);

        if (!senhaCorreta) {
            throw new AppError("Email ou senha inválidos", 401);
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new AppError("JWT_SECRET não configurado no .env", 500);
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                perfil: usuario.perfil
            },
            jwtSecret,
            {
                subject: usuario.id,
                expiresIn: "1d"
            }
        );

        return {
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            },
            token
        };
    }
}