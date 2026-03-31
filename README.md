# 🏭 LotePath - Rastreamento de Produção por Lote

Um sistema de rastreabilidade industrial desenvolvido para digitalizar o controle de lotes, insumos e inspeções de qualidade, otimizando o processo de recall e auditoria.

## 🚀 O Projeto

A rastreabilidade é fundamental na indústria para isolar problemas e evitar recalls desnecessários. Este sistema resolve isso garantindo que cada lote produzido tenha um registro claro de quem o operou, quais materiais (insumos) foram utilizados e qual foi o laudo de qualidade final.

O grande diferencial do LotePath é permitir a **rastreabilidade reversa**: dado um insumo defeituoso, o sistema localiza em segundos todos os lotes de produtos finais que foram afetados.

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express, TypeScript (padrão ES Modules via `tsx`)
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM
- **Frontend:** Angular 21 e Tailwind CSS *(Em desenvolvimento)*

## 📦 Funcionalidades da Fase 1

A fundação do backend já está estruturada com:
- [x] Configuração do ambiente TypeScript com ESM.
- [x] Modelagem de banco de dados relacional (Tabelas: `Produto`, `Lote`, `InsumoLote`, `InspecaoLote`, `Usuario`).
- [x] Sincronização automática das tabelas via TypeORM.
- [x] Seed inicial de dados (Produtos, Usuários e Lotes variados).
- [x] Endpoint base para listagem e validação dos dados.

## ⚙️ Como Executar Localmente (Backend)

### 1. Requisitos
- Node.js instalado.
- PostgreSQL rodando localmente (porta `5432`).

### 2. Banco de Dados
Abra o seu gerenciador do PostgreSQL (pgAdmin, DBeaver, psql) e crie o banco de dados principal vazio:

```sql
CREATE DATABASE lotepath;
```
*(Certifique-se de que as credenciais no arquivo `src/data-source.ts` correspondem ao seu usuário e senha locais do Postgres).*

### 3. Instalação
Clone o repositório, acesse a pasta do backend e instale as dependências:

```bash
npm install
```

### 4. Rodando a Aplicação
Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

> 💡 **Aviso:** Na primeira execução, o TypeORM criará todas as tabelas automaticamente e o Seed irá popular o banco com os dados iniciais.

### 5. Testando
Com o servidor online, acesse a rota abaixo para verificar a listagem dos lotes gerados:
👉 `http://localhost:3000/lotes`

---
*Projeto desenvolvido para o Módulo 10 da trilha Full Stack - INDT.*
