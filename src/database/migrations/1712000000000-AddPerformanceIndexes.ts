import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPerformanceIndexes1712000000000 implements MigrationInterface {
    name = 'AddPerformanceIndexes1712000000000';

    public async up(_queryRunner: QueryRunner): Promise<void> {
        // No-op:
        // O projeto atual utiliza synchronize e não registra/executa migrations
        // de forma consistente. Para evitar divergência/duplicidade de schema,
        // os índices devem ser mantidos fora desta migration enquanto essa
        // estratégia de configuração permanecer.
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        // No-op pelo mesmo motivo do método up().
    }
}
