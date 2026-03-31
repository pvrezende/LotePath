import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entities/Usuario.js";
import { Produto } from "./entities/Produto.js";
import { Lote } from "./entities/Lote.js";
import { InsumoLote } from "./entities/InsumoLote.js";
import { InspecaoLote } from "./entities/InspecaoLote.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "seu_usuario_postgres", // Altere aqui
    password: "sua_senha_postgres", // Altere aqui
    database: "lotepath", // Crie este DB vazio no PGAdmin/psql primeiro
    synchronize: true, // Cria e atualiza as tabelas automaticamente
    logging: false,
    entities: [Usuario, Produto, Lote, InsumoLote, InspecaoLote],
    subscribers: [],
    migrations: [],
});