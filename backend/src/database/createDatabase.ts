import 'dotenv/config';
import { Client } from 'pg';

async function createDatabase() {
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: 'postgres',
  });

  const dbName = process.env.DB_NAME || 'indt_lotepath';

  try {
    await adminClient.connect();

    const checkResult = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkResult.rowCount && checkResult.rowCount > 0) {
      console.log(`Banco "${dbName}" já existe.`);
    } else {
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Banco "${dbName}" criado com sucesso.`);
    }
  } catch (error) {
    console.error('Erro ao criar banco:', error);
  } finally {
    await adminClient.end();
  }
}

createDatabase();