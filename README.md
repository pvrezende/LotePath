# 🏭 LotePath - Backend (API)

Repositório contendo o backend do **LotePath**, um sistema de rastreamento de produção por lote desenvolvido para o Módulo 10 da trilha Full Stack do INDT, focado nas demandas do Polo Industrial de Manaus (PIM).

## 🚀 O Projeto

O LotePath fornece uma API RESTful robusta para digitalizar o controle de produção, permitindo a abertura de lotes, vínculo de insumos (rastreabilidade de 1º nível) e registros de inspeção de qualidade. O grande diferencial de negócio é a **rastreabilidade reversa**, capaz de identificar rapidamente todos os lotes afetados por um insumo suspeito.

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as melhores práticas do ecossistema JavaScript/TypeScript moderno (ES Modules):
- **Core:** Node.js (v22), Express.js, TypeScript.
- **Banco de Dados:** PostgreSQL com ORM TypeORM.
- **Segurança & Autenticação:** JWT (JSON Web Tokens), Bcryptjs, Helmet, Express Rate Limit.
- **Validação:** Zod (para validação de schemas e DTOs).
- **Execução & Build:** `tsx` (para dev) e `tsc` (para build).

## 📂 Arquitetura do Projeto

O código está organizado em uma arquitetura em camadas para separar responsabilidades, facilitar a manutenção e escalar o sistema:

```text
src/
 ├── controllers/   # Lida com as requisições HTTP e envia as respostas.
 ├── database/      # Configuração do AppDataSource (TypeORM).
 ├── dtos/          # Data Transfer Objects (Tipagens e schemas do Zod).
 ├── entities/      # Modelos de banco de dados (Produto, Lote, Usuario, etc.).
 ├── errors/        # Classes customizadas para tratamento de exceções.
 ├── middlewares/   # Interceptadores (ex: Autenticação, Error Handler global).
 ├── routes/        # Definição dos endpoints da API.
 ├── services/      # Regras de negócio da aplicação.
 ├── types/         # Definições de tipos globais do TypeScript.
 └── server.ts      # Ponto de entrada (Entrypoint) da aplicação.
```

## ⚙️ Como Executar Localmente

Siga os passos abaixo para configurar o ambiente de desenvolvimento na sua máquina.

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.
- [PostgreSQL](https://www.postgresql.org/) rodando localmente (porta `5432`).

### 2. Configuração do Banco de Dados e Variáveis de Ambiente
No seu gerenciador do PostgreSQL, crie um banco de dados vazio:
```sql
CREATE DATABASE lotepath;
```

Crie um arquivo `.env` na raiz do projeto (use o `.env.example` caso exista como base) e configure suas credenciais locais do Postgres e a porta do servidor:
```env
PORT=3000
# Adicione aqui as variáveis de conexão do TypeORM/JWT que o projeto exigir
```

### 3. Instalação das Dependências
Clone o repositório, entre na pasta do projeto e rode o comando:
```bash
npm install
```

### 4. Rodando em Modo de Desenvolvimento
Para iniciar o servidor com *hot-reload* (usando o `tsx`), utilize o comando:
```bash
npm run dev
```
> O servidor iniciará, fará a sincronização automática das tabelas no banco de dados através do TypeORM e ficará disponível em `http://localhost:3000`.

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento (observando mudanças).
- `npm run build`: Compila o código TypeScript para JavaScript puro na pasta `/dist`.
- `npm run start`: Executa a versão compilada para produção.

---
*Desenvolvido pela equipe para o programa INDT.*
