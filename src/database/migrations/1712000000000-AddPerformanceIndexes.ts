import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPerformanceIndexes1712000000000 implements MigrationInterface {
    name = 'AddPerformanceIndexes1712000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Índices para Lote (Dashboard + Filtros RF08)
        // Tabela: lote (singular, conforme entity Lote.ts)
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_lote_data_status" ON "lote" ("data_producao", "status")`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_lote_numero" ON "lote" ("numero_lote")`);
        
        // Índices para Insumo_lote (Rastreabilidade Reversa RF11)
        // Tabela: insumo_lote (singular com underscore, conforme entity Insumo_lote.ts)
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_insumo_codigo" ON "insumo_lote" ("codigo_insumo", "lote_insumo")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_insumo_lote_id" ON "insumo_lote" ("lote_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_lote_data_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_lote_numero"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_insumo_codigo"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_insumo_lote_id"`);
    }
}
