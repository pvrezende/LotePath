import "reflect-metadata";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { AppDataSource } from "./AppDataSource.js";
import { Produto } from "../entities/Produto.js";
import { Usuario } from "../entities/Usuario.js";
import { Lote } from "../entities/Lote.js";
import { Perfil } from "../types/Perfil.js";

async function seed() {
    await AppDataSource.initialize();

    const produtoRepo = AppDataSource.getRepository(Produto);
    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const loteRepo = AppDataSource.getRepository(Lote);

    console.log("Limpando dados antigos...");
    await AppDataSource.query(
        'TRUNCATE TABLE "inspecao_lote", "insumo_lote", "lotes", "usuarios", "produtos" RESTART IDENTITY CASCADE'
    );

    console.log("Criando produtos...");
    const produtos = produtoRepo.create([
        {
            codigo: "PRD-001",
            nome: "Placa Eletrônica A",
            descricao: "Placa principal do equipamento",
            linha: "Linha 1",
            ativo: true
        },
        {
            codigo: "PRD-002",
            nome: "Módulo Sensor B",
            descricao: "Módulo de leitura e monitoramento",
            linha: "Linha 2",
            ativo: true
        },
        {
            codigo: "PRD-003",
            nome: "Painel de Controle C",
            descricao: "Painel frontal de operação",
            linha: "Linha 1",
            ativo: true
        }
    ]);

    await produtoRepo.save(produtos);

    console.log("Criando usuários...");
    const senhaHash = await bcrypt.hash("123456", 10);

    const usuarios = usuarioRepo.create([
        {
            nome: "Operador Teste",
            email: "operador@lotepath.com",
            senha: senhaHash,
            perfil: Perfil.OPERADOR
        },
        {
            nome: "Inspetor Teste",
            email: "inspetor@lotepath.com",
            senha: senhaHash,
            perfil: Perfil.INSPETOR
        }
    ]);

    await usuarioRepo.save(usuarios);

    const operador = usuarios.find((u) => u.perfil === Perfil.OPERADOR);

    if (!operador) {
        throw new Error("Operador não encontrado para criação dos lotes.");
    }

    console.log("Criando lotes...");
    const lotes = loteRepo.create([
        {
            numero_lote: "LOT-2025-00001",
            produto: produtos[0],
            data_producao: new Date("2025-09-01"),
            turno: "manha",
            operador,
            quantidade_prod: 100,
            quantidade_repr: 0,
            status: "em_producao",
            observacoes: "Lote em produção",
            encerrado_em: null
        },
        {
            numero_lote: "LOT-2025-00002",
            produto: produtos[1],
            data_producao: new Date("2025-09-02"),
            turno: "tarde",
            operador,
            quantidade_prod: 150,
            quantidade_repr: 0,
            status: "aguardando_inspecao",
            observacoes: "Aguardando inspeção final",
            encerrado_em: new Date("2025-09-02T16:00:00")
        },
        {
            numero_lote: "LOT-2025-00003",
            produto: produtos[2],
            data_producao: new Date("2025-09-03"),
            turno: "noite",
            operador,
            quantidade_prod: 200,
            quantidade_repr: 2,
            status: "aprovado",
            observacoes: "Lote aprovado",
            encerrado_em: new Date("2025-09-03T23:00:00")
        },
        {
            numero_lote: "LOT-2025-00004",
            produto: produtos[0],
            data_producao: new Date("2025-09-04"),
            turno: "manha",
            operador,
            quantidade_prod: 120,
            quantidade_repr: 5,
            status: "aprovado_restricao",
            observacoes: "Aprovado com restrição",
            encerrado_em: new Date("2025-09-04T11:30:00")
        },
        {
            numero_lote: "LOT-2025-00005",
            produto: produtos[1],
            data_producao: new Date("2025-09-05"),
            turno: "tarde",
            operador,
            quantidade_prod: 90,
            quantidade_repr: 10,
            status: "reprovado",
            observacoes: "Reprovado por não conformidade",
            encerrado_em: new Date("2025-09-05T17:20:00")
        }
    ]);

    await loteRepo.save(lotes);

    console.log("Seed executado com sucesso!");
    console.log("Usuários criados:");
    console.log("operador@lotepath.com / 123456");
    console.log("inspetor@lotepath.com / 123456");

    await AppDataSource.destroy();
}

seed().catch(async (error) => {
    console.error("Erro ao executar seed:", error);

    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});