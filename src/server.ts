import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';
import { AppDataSource } from './database/AppDataSource.js';
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// Rotas de teste
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

AppDataSource.initialize()
    .then(() => {
        console.log('Banco de dados conectado!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar o banco:', error);
    });
