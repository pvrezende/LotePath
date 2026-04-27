import { DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario.js";
import { Produto } from "../entities/Produto.js";
import { Lote } from "../entities/Lote.js";
import { InsumoLote } from "../entities/Insumo_lote.js";
import { InspecaoLote } from "../entities/Inspecao_lote.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
    synchronize: true,
    logging: true,
    entities: [Usuario, Produto, Lote, InsumoLote, InspecaoLote],
});