# LotePath

Sistema web de rastreamento de produção por lotes, desenvolvido para o programa **INDT**, com foco em controle produtivo, inspeção de qualidade, vínculo de insumos, rastreabilidade e apoio a cenários de recall.

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
- middleware de autenticação nas rotas privadas
- controle de acesso por perfil
- CRUD de produtos
- abertura de lotes com número automático
- listagem e detalhamento de lotes
- atualização de status do lote
- vínculo de insumos por lote
- remoção de insumos por lote
- registro de inspeção
- rastreabilidade por lote
- rastreabilidade por insumo
- endpoint de dashboard com indicadores e últimos lotes
- seed com dados iniciais de teste
- script automático para criação do banco de dados

### Frontend
- login integrado ao backend
- armazenamento de token e usuário em sessão
- rotas protegidas com guard
- interceptor de autenticação
- interceptor de erro e sessão
- dashboard com dados reais da API
- cards de indicadores
- últimos lotes
- badges de status
- loading, mensagens de erro e empty state
- navbar e footer
- tela de produtos com listagem e cadastro
- tela de lotes com abertura e listagem
- modal de detalhes do lote
- integração com `environment.ts`
- melhorias de responsividade em andamento

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
├── backend/                  # backend principal da aplicação
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── dtos/
│   │   ├── entities/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── frontend/                 # aplicação Angular
│   ├── src/
│   ├── package.json
│   └── ...
├── README.md
└── apresentação.md
```

## Requisitos

Antes de executar o projeto, é necessário ter instalado na máquina:

- Node.js
- npm
- PostgreSQL
- Angular CLI (opcional, caso utilize `ng serve` diretamente)

## Como executar o backend

### 1. Entre na pasta do backend

```bash
cd backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Use o arquivo `.env.example` como base e crie um arquivo `.env` dentro da pasta `backend`.

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

### 4. Crie automaticamente o banco de dados

Com o PostgreSQL instalado e rodando, execute:

```bash
npm run db:create
```

Esse script cria automaticamente o banco `indt_lotepath`, caso ele ainda não exista.

### 5. Rode o seed

Esse comando popula o banco com dados iniciais de teste:

```bash
npm run seed
```

### 6. Inicie o backend

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

No frontend, a URL do backend fica centralizada em:

```text
src/environments/environment.ts
src/environments/environment.development.ts
```

Valor padrão:

```ts
apiUrl: 'http://localhost:5336'
```

### 4. Inicie o frontend

```bash
npm start
```

ou

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

### Gestor
- E-mail: `gestor@lotepath.com`
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
2. autenticar com um usuário de teste
3. abrir o dashboard
4. mostrar os indicadores e os últimos lotes
5. mostrar o cadastro de produtos
6. abrir um novo lote
7. abrir o modal de detalhes do lote
8. navegar para o fluxo de rastreabilidade
9. demonstrar o cenário de recall com insumo suspeito

## Observações técnicas

- o frontend **não acessa o banco diretamente**
- a conexão com PostgreSQL acontece apenas no backend
- o frontend consome a API usando a URL configurada no `environment.ts`
- variáveis sensíveis ficam no arquivo `.env`, que não deve ser enviado ao GitHub
- o arquivo `.env.example` serve como modelo de configuração para rodar o projeto em qualquer máquina
- o backend principal da aplicação está na pasta `backend`
- o script `npm run db:create` cria o banco automaticamente, mas o PostgreSQL precisa estar instalado e rodando
- o script de criação do banco depende das credenciais informadas no arquivo `.env`

## Como rodar o projeto em qualquer PC

### Backend
1. instalar Node.js
2. instalar PostgreSQL
3. configurar o arquivo `.env` em `backend/`
4. rodar `npm install` em `backend/`
5. rodar `npm run db:create`
6. rodar `npm run seed`
7. rodar `npm run dev`

### Frontend
1. entrar em `frontend/`
2. rodar `npm install`
3. conferir a URL da API em `src/environments/`
4. rodar `npm start` ou `ng serve`

## Status do projeto

Projeto com backend funcional, frontend Angular funcional e fluxo principal já integrado para login, dashboard, produtos e lotes. As próximas evoluções incluem insumos por lote, inspeção no frontend, rastreabilidade visual, polimento final de responsividade e apresentação.

## Autores

- Paulo Rezende
- Kariton Gomes
- André Filipe

Desenvolvido para o programa **INDT**.
