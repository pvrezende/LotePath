# LotePath

Sistema web de rastreamento de produção por lotes, desenvolvido para o programa **INDT**, com foco em controle produtivo, inspeção de qualidade, rastreabilidade e apoio a cenários de recall.

## Visão geral

O LotePath foi criado para digitalizar o processo de rastreamento de lotes de produção, permitindo registrar:

- abertura de lotes
- vínculo de insumos por lote
- inspeção de qualidade
- rastreabilidade por lote e por insumo
- dashboard com indicadores operacionais

O objetivo do projeto é facilitar a identificação de lotes afetados em caso de falha de insumo, não conformidade ou recall, reduzindo tempo de análise e melhorando a visibilidade do processo produtivo.

## Problema que o projeto resolve

Em ambientes industriais, a rastreabilidade de produção é essencial para responder perguntas como:

- qual lote foi produzido em determinada data
- quais insumos foram usados nesse lote
- quem foi o operador responsável
- quais lotes podem ter sido afetados por um insumo suspeito

Sem um sistema centralizado, esse processo costuma depender de papel, planilhas ou consultas manuais, tornando recalls e auditorias mais lentos e arriscados. O LotePath organiza essas informações em uma aplicação web com backend e frontend integrados. :contentReference[oaicite:0]{index=0}

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
└── README.md

-----------------------------------------------------
Como executar o backend
1. Instale as dependências
npm install
-----------------------------------------------------
2. Configure o arquivo .env

Use o .env.example como base e crie um arquivo .env na raiz.

Exemplo:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=indt_lotepath
PORT=5336
JWT_SECRET=sua_chave_jwt
-----------------------------------------------------
3. Crie o banco PostgreSQL
CREATE DATABASE indt_lotepath;
-----------------------------------------------------
4. Rode o seed
npm run seed
-----------------------------------------------------
5. Inicie o backend
npm run dev
-----------------------------------------------------
Backend disponível em:
http://localhost:5336
-----------------------------------------------------
#####################################################
-----------------------------------------------------

Como executar o frontend
1. Entre na pasta do frontend
cd frontend
-----------------------------------------------------
2. Instale as dependências
npm install
-----------------------------------------------------
3. Inicie o frontend
ng serve
Frontend disponível em:
http://localhost:4200
-----------------------------------------------------

Credenciais de teste

Criadas pelo seed do backend:

Operador
E-mail: operador@lotepath.com
Senha: 123456
Inspetor
E-mail: inspetor@lotepath.com
Senha: 123456
Rotas principais da API
Autenticação
POST /auth/login
Produtos
GET /produtos
GET /produtos/:id
POST /produtos
PUT /produtos/:id
DELETE /produtos/:id
Lotes
GET /lotes
GET /lotes/:id
POST /lotes
PATCH /lotes/:id/status
Insumos
POST /lotes/:id/insumos
DELETE /lotes/:id/insumos/:insumoId
Inspeção
POST /lotes/:id/inspecao
Rastreabilidade
GET /rastreabilidade/lote/:id
GET /rastreabilidade/insumo?valor=...
Dashboard
GET /dashboard
Fluxo principal de demonstração

Sugestão de apresentação final:

acessar a tela de login
autenticar com usuário de teste
abrir o dashboard
mostrar indicadores e últimos lotes
mostrar os status dos lotes
navegar para o fluxo de rastreabilidade
demonstrar o cenário de recall com insumo suspeito

O dashboard com 4 indicadores e os últimos 10 lotes faz parte do entregável da Fase 5.

Status do projeto

Projeto em evolução, com backend funcional até a Fase 5 e frontend em construção orientada para demonstração final.

Autores

Paulo Rezende
Kariton Gomes
André Filipe

Desenvolvido para o programa INDT.