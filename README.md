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

```text
src/
 ├── controllers/   
 ├── database/      
 ├── dtos/          
 ├── entities/      
 ├── errors/        
 ├── middlewares/   
 ├── routes/        
 ├── services/      
 ├── types/         
 └── server.ts      
```

## ⚙️ Como Executar Localmente

### 1. Pré-requisitos
- Node.js instalado
- PostgreSQL instalado

### 2. Configuração do Banco

```sql
CREATE DATABASE indt_lotepath;
```

### 3. Variáveis de Ambiente

Copie o arquivo `.env.example` e renomeie para `.env`.

No Windows:
- Clique com botão direito → copiar → colar → renomear para `.env`

Ou via terminal:

```bash
copy .env.example .env
```

Configure:

```env
# Host do banco
DB_HOST=localhost

# Porta da aplicação
PORT=5336

# Usuário do banco
DB_USER=postgres

# Senha do banco
DB_PASS=sua_senha

# Nome do banco
DB_NAME=indt_lotepath
```

### 4. Instalar dependências

```bash
npm install
```

### 5. Rodar o projeto

```bash
npm run dev
```

Servidor disponível em:
http://localhost:5336

## 🔎 Testando a API

Após iniciar o servidor, acesse:

http://localhost:5336

Se estiver rodando corretamente, a API deve responder.

## 📜 Scripts

- `npm run dev` → inicia o servidor em modo desenvolvimento (hot reload)
- `npm run build` → compila o TypeScript para JavaScript
- `npm run start` → executa a versão de produção

---

Desenvolvido para o programa INDT.

## 📌 Observações

- Certifique-se de que o PostgreSQL está rodando antes de iniciar a aplicação
- As tabelas são sincronizadas automaticamente pelo TypeORM