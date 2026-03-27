import DataSource from "typeorm";
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
    synchronize: true, // Desativar em produção e mudar para migrations em produção
    logging: true, // Pra ver os comando sqls gerados
    entities: ['src/entities/**/*.ts']
});