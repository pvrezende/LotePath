import "reflect-metadata";
import "dotenv/config";

import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/AppDataSource.js";
import indexRouter from "./routes/indexRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
    cors({
        origin: "http://localhost:4200",
        credentials: true
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API LotePath rodando");
});

app.use(indexRouter);
app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado!");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar o banco:", error);
    });