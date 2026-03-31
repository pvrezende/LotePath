import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source.js";
import { Usuario } from "./entities/Usuario.js";
import { Produto } from "./entities/Produto.js";
import { Lote, StatusLote, Turno } from "./entities/Lote.js";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint Entregável da Fase 1 
app.get("/lotes", async (req, res) => {
    try {
        const lotes = await AppDataSource.getRepository(Lote).find({
            relations: ["produto", "operador"]
        });
        res.json(lotes);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar lotes" });
    }
});

// Inicialização do Banco e Seed
AppDataSource.initialize().then(async () => {
    console.log("🔥 Banco de dados conectado via TypeORM!");

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const produtoRepo = AppDataSource.getRepository(Produto);
    const loteRepo = AppDataSource.getRepository(Lote);

    const count = await usuarioRepo.count();
    
    // Seed: 3 produtos, 2 usuários, 5 lotes variados 
    if (count === 0) {
        console.log("🌱 Executando Seed da Fase 1...");

        const operador = await usuarioRepo.save(usuarioRepo.create({ nome: 'Operador 1', email: 'op@lotepath.com', senha: '123', perfil: 'operador' }));
        const inspetor = await usuarioRepo.save(usuarioRepo.create({ nome: 'Inspetor 1', email: 'insp@lotepath.com', senha: '123', perfil: 'inspetor' }));

        const p1 = await produtoRepo.save(produtoRepo.create({ codigo: 'PRD-001', nome: 'Placa Principal', linha: 'L1' }));
        const p2 = await produtoRepo.save(produtoRepo.create({ codigo: 'PRD-002', nome: 'Fonte 12V', linha: 'L2' }));
        const p3 = await produtoRepo.save(produtoRepo.create({ codigo: 'PRD-003', nome: 'Display 32"', linha: 'L1' }));

        await loteRepo.save([
            loteRepo.create({ numero_lote: 'LOT-2026-001', produto: p1, data_producao: '2026-03-31', turno: Turno.MANHA, operador, quantidade_prod: 500, status: StatusLote.EM_PRODUCAO }),
            loteRepo.create({ numero_lote: 'LOT-2026-002', produto: p2, data_producao: '2026-03-31', turno: Turno.TARDE, operador, quantidade_prod: 300, status: StatusLote.AGUARDANDO_INSPECAO }),
            loteRepo.create({ numero_lote: 'LOT-2026-003', produto: p3, data_producao: '2026-03-30', turno: Turno.NOITE, operador, quantidade_prod: 1000, status: StatusLote.APROVADO }),
            loteRepo.create({ numero_lote: 'LOT-2026-004', produto: p1, data_producao: '2026-03-30', turno: Turno.MANHA, operador, quantidade_prod: 450, status: StatusLote.APROVADO_RESTRICAO }),
            loteRepo.create({ numero_lote: 'LOT-2026-005', produto: p2, data_producao: '2026-03-29', turno: Turno.TARDE, operador, quantidade_prod: 200, status: StatusLote.REPROVADO })
        ]);
        console.log("✅ Seed finalizado!");
    }

    app.listen(3000, () => {
        console.log("🚀 Servidor rodando na porta 3000. Teste: http://localhost:3000/lotes");
    });
}).catch(error => console.error("❌ Erro ao inicializar DB:", error));
