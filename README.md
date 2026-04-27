# LotePath

Sistema web de rastreamento de produção por lotes, desenvolvido para o programa **INDT**, com foco em controle produtivo, inspeção de qualidade, rastreabilidade e apoio a cenários de recall.

## Visão geral

O **LotePath** foi criado para digitalizar o processo de rastreamento de lotes de produção, permitindo registrar:

- abertura de lotes
- vínculo de insumos por lote
- inspeção de qualidade
- rastreabilidade por lote e por insumo
- dashboard com indicadores operacionais

O objetivo do projeto é facilitar a identificação de lotes afetados em caso de falha de insumo, não conformidade ou recall, reduzindo o tempo de análise e melhorando a visibilidade do processo produtivo.

## Problema que o projeto resolve

Em ambientes industriais, a rastreabilidade de produção é essencial para responder perguntas como:

- qual lote foi produzido em determinada data
- quais insumos foram usados nesse lote
- quem foi o operador responsável
- quais lotes podem ter sido afetados por um insumo suspeito

Sem um sistema centralizado, esse processo costuma depender de papel, planilhas ou consultas manuais, tornando recalls e auditorias mais lentos e arriscados. O LotePath organiza essas informações em uma aplicação web com backend e frontend integrados.

## Funcionalidades implementadas

### Backend
- autenticação com JWT
- controle de acesso por perfil
- CRUD de produtos
- abertura de lotes com número automático
- atualização de status do lote
- vínculo de insumos por lote
- registro de inspeção
- rastreabilidade por lote
- rastreabilidade por insumo
- endpoint de dashboard com indicadores e últimos lotes

### Frontend
- login com integração real ao backend
- armazenamento de token e sessão
- rotas protegidas com guard
- interceptor para envio automático do token
- logout
- dashboard com:
  - indicadores
  - últimos lotes
  - badges de status
  - loading
  - tratamento de erro
  - empty state
- layout com navbar e footer

## Stack utilizada

### Frontend
- Angular
- TypeScript
- CSS

### Backend
- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- JWT
- Zod

## Estrutura do projeto

```text
LotePath/
├── backend/                  # pasta auxiliar enviada no projeto
├── frontend/                 # aplicação Angular
├── src/                      # backend principal
│   ├── controllers/
│   ├── database/
│   ├── dtos/
│   ├── entities/
│   ├── errors/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── server.ts
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Configuração do projeto

### Requisitos

Antes de executar o projeto, é necessário ter instalado na máquina:

- Node.js
- npm
- PostgreSQL
- Angular CLI

## Como executar o backend

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o arquivo `.env`
Use o arquivo `.env.example` como base e crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=indt_lotepath

# Aplicação
PORT=5336
JWT_SECRET=sua_chave_jwt
```

### 3. Crie o banco PostgreSQL
No PostgreSQL, crie o banco com o nome:

```sql
CREATE DATABASE indt_lotepath;
```

### 4. Rode o seed
Esse comando popula o banco com dados iniciais de teste:

```bash
npm run seed
```

### 5. Inicie o backend
```bash
npm run dev
```

Backend disponível em:

```text
http://localhost:5336
```

## Como executar o frontend

### 1. Entre na pasta do frontend
```bash
cd frontend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure a URL da API no Angular
No frontend, o acesso ao backend deve ser feito via `environment.ts`, apontando para:

```ts
apiUrl: 'http://localhost:5336'
```

### 4. Inicie o frontend
```bash
ng serve
```

Frontend disponível em:

```text
http://localhost:4200
```

## Credenciais de teste

Criadas pelo seed do backend:

### Operador
- E-mail: `operador@lotepath.com`
- Senha: `123456`

### Inspetor
- E-mail: `inspetor@lotepath.com`
- Senha: `123456`

## Rotas principais da API

### Autenticação
- `POST /auth/login`

### Produtos
- `GET /produtos`
- `GET /produtos/:id`
- `POST /produtos`
- `PUT /produtos/:id`
- `DELETE /produtos/:id`

### Lotes
- `GET /lotes`
- `GET /lotes/:id`
- `POST /lotes`
- `PATCH /lotes/:id/status`

### Insumos
- `POST /lotes/:id/insumos`
- `DELETE /lotes/:id/insumos/:insumoId`

### Inspeção
- `POST /lotes/:id/inspecao`

### Rastreabilidade
- `GET /rastreabilidade/lote/:id`
- `GET /rastreabilidade/insumo?valor=...`

### Dashboard
- `GET /dashboard`

## Fluxo principal de demonstração

Sugestão de apresentação final:

1. acessar a tela de login
2. autenticar com usuário de teste
3. abrir o dashboard
4. mostrar os indicadores e os últimos lotes
5. mostrar os badges de status
6. navegar para o fluxo de rastreabilidade
7. demonstrar o cenário de recall com insumo suspeito

## Observações técnicas

- o frontend **não acessa o banco diretamente**
- a conexão com PostgreSQL acontece apenas no backend
- o frontend consome a API usando a URL configurada no `environment.ts`
- variáveis sensíveis ficam no arquivo `.env`, que não deve ser enviado ao GitHub
- o arquivo `.env.example` serve como modelo de configuração para rodar o projeto em qualquer máquina

## Status do projeto

Projeto com backend funcional até a Fase 4, autenticação com JWT, controle de acesso por perfil e estrutura pronta para a etapa final de dashboard, polimento e apresentação.

## Autores

- Paulo Rezende
- Kariton Gomes
- André Filipe

Desenvolvido para o programa **INDT**.
