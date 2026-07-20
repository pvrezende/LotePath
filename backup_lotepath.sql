--
-- PostgreSQL database dump
--

\restrict BJEY5mM3fuiGW4TSolzurAGSyFKsqWl5TKtqVIcZcZMOegnJksyc0aqAZ3woFPi

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: inspecao_lote_resultado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inspecao_lote_resultado_enum AS ENUM (
    'aprovado',
    'aprovado_restricao',
    'reprovado'
);


ALTER TYPE public.inspecao_lote_resultado_enum OWNER TO postgres;

--
-- Name: lotes_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lotes_status_enum AS ENUM (
    'em_producao',
    'aguardando_inspecao',
    'aprovado',
    'aprovado_restricao',
    'reprovado'
);


ALTER TYPE public.lotes_status_enum OWNER TO postgres;

--
-- Name: lotes_turno_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lotes_turno_enum AS ENUM (
    'manha',
    'tarde',
    'noite'
);


ALTER TYPE public.lotes_turno_enum OWNER TO postgres;

--
-- Name: usuarios_perfil_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usuarios_perfil_enum AS ENUM (
    'operador',
    'inspetor',
    'gestor'
);


ALTER TYPE public.usuarios_perfil_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    modulo character varying(80) NOT NULL,
    acao character varying(80) NOT NULL,
    descricao text NOT NULL,
    usuario_id uuid,
    usuario_nome character varying(120),
    usuario_perfil character varying(40),
    detalhes jsonb,
    criado_em timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: inspecao_lote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspecao_lote (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    resultado public.inspecao_lote_resultado_enum NOT NULL,
    quantidade_repr integer DEFAULT 0 NOT NULL,
    descricao_desvio text,
    inspecionado_em timestamp with time zone DEFAULT now() NOT NULL,
    "loteId" uuid,
    "inspetorId" uuid NOT NULL
);


ALTER TABLE public.inspecao_lote OWNER TO postgres;

--
-- Name: insumo_lote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insumo_lote (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome_insumo character varying NOT NULL,
    codigo_insumo character varying,
    lote_insumo character varying,
    quantidade numeric NOT NULL,
    unidade character varying NOT NULL,
    "loteId" uuid NOT NULL
);


ALTER TABLE public.insumo_lote OWNER TO postgres;

--
-- Name: lotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lotes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    numero_lote character varying NOT NULL,
    data_producao date NOT NULL,
    turno public.lotes_turno_enum NOT NULL,
    quantidade_prod integer NOT NULL,
    quantidade_repr integer DEFAULT 0 NOT NULL,
    status public.lotes_status_enum DEFAULT 'em_producao'::public.lotes_status_enum NOT NULL,
    observacoes text,
    aberto_em timestamp with time zone DEFAULT now() NOT NULL,
    encerrado_em timestamp with time zone,
    "produtoId" uuid NOT NULL,
    "operadorId" uuid NOT NULL
);


ALTER TABLE public.lotes OWNER TO postgres;

--
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    codigo character varying NOT NULL,
    nome character varying NOT NULL,
    descricao text,
    linha character varying NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying NOT NULL,
    senha character varying NOT NULL,
    perfil public.usuarios_perfil_enum NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, modulo, acao, descricao, usuario_id, usuario_nome, usuario_perfil, detalhes, criado_em) FROM stdin;
92927762-6066-4539-a262-287b30d0a5a2	inspecao	INSPECAO_REGISTRADA	Inspeção registrada no lote LOT-2026-00014	79ad98dc-126c-4368-8343-3f89354e9664	Inspetor Teste	inspetor	{"loteId": "317afe26-37a0-40b5-82df-6c7d8b6079db", "resultado": "reprovado", "inspecaoId": "08cdc7a5-75bc-4100-9d59-952bac3c3002", "numero_lote": "LOT-2026-00014", "quantidade_repr": 10, "descricao_desvio": "precisa refazer"}	2026-04-29 18:30:13.100225-04
d5f1249f-65d8-452b-a99a-f9dcbf95a8a2	inspecao	INSPECAO_REGISTRADA	Inspeção registrada no lote LOT-2026-00010	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "4e0ce40c-15d3-466a-a329-a833b4ae49b5", "resultado": "aprovado", "inspecaoId": "8c24c4cb-c948-4be7-a88e-0a3304d5260e", "numero_lote": "LOT-2026-00010", "quantidade_repr": 20, "descricao_desvio": "deu tudo certo"}	2026-04-29 18:33:59.123448-04
5fd4afc9-cff8-4434-9489-657607079403	inspecao	INSPECAO_EXCLUIDA	Inspeção excluída do lote LOT-2026-00010	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "4e0ce40c-15d3-466a-a329-a833b4ae49b5", "inspecao": {"id": "8c24c4cb-c948-4be7-a88e-0a3304d5260e", "resultado": "aprovado", "quantidade_repr": 20, "descricao_desvio": "deu tudo certo"}, "numero_lote": "LOT-2026-00010"}	2026-04-29 18:34:12.777216-04
8206858d-c92b-4d6d-81d2-1f34fdd276fa	insumos	INSUMO_ADICIONADO	Insumo Resina ABS adicionado ao lote LOT-2026-00012	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "9044267a-fad2-4de6-8048-a58ef1ad3751", "unidade": "UN", "insumoId": "71dbb23c-9384-4e3b-ac33-a7f8a8fab49d", "quantidade": 20, "lote_insumo": "LOTE-ABS-2026-0111", "nome_insumo": "Resina ABS", "numero_lote": "LOT-2026-00012", "codigo_insumo": "INS-00111"}	2026-04-29 19:30:53.099861-04
15e69456-6ddc-444b-9775-955fe6ce276b	insumos	INSUMO_REMOVIDO	Insumo Resina ABS removido do lote LOT-2026-00012	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "9044267a-fad2-4de6-8048-a58ef1ad3751", "unidade": "UN", "insumoId": "71dbb23c-9384-4e3b-ac33-a7f8a8fab49d", "quantidade": "20", "lote_insumo": "LOTE-ABS-2026-0111", "nome_insumo": "Resina ABS", "numero_lote": "LOT-2026-00012", "codigo_insumo": "INS-00111"}	2026-04-29 19:30:59.38003-04
31426ee4-de3f-474e-8b13-0ddbd39c8f32	inspecao	INSPECAO_EXCLUIDA	Inspeção excluída do lote LOT-2026-00014	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "317afe26-37a0-40b5-82df-6c7d8b6079db", "inspecao": {"id": "08cdc7a5-75bc-4100-9d59-952bac3c3002", "resultado": "reprovado", "quantidade_repr": 10, "descricao_desvio": "precisa refazer"}, "numero_lote": "LOT-2026-00014"}	2026-04-29 19:31:10.094356-04
c2515a56-580f-4000-b5b5-bb0de2a77a36	insumos	INSUMO_ADICIONADO	Insumo Cabo de rede de 1M adicionado ao lote LOT-2026-00012	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "9044267a-fad2-4de6-8048-a58ef1ad3751", "unidade": "UN", "insumoId": "7c5b2524-50d1-49bf-858b-a16d71e0a4ca", "quantidade": 100, "lote_insumo": "LOTE-RJ45-100", "nome_insumo": "Cabo de rede de 1M", "numero_lote": "LOT-2026-00012", "codigo_insumo": "Cabo de rede rj45-157"}	2026-04-30 11:13:37.70168-04
de65b972-5db9-473e-8f22-a4940726884a	inspecao	INSPECAO_REGISTRADA	Inspeção registrada no lote LOT-2026-00012	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "9044267a-fad2-4de6-8048-a58ef1ad3751", "resultado": "aprovado", "inspecaoId": "d9afacfb-35e2-4e37-9611-e5d60a498642", "numero_lote": "LOT-2026-00012", "quantidade_repr": 0, "descricao_desvio": "TODOS APROVADOS"}	2026-04-30 11:17:27.776594-04
f93dba9a-5d74-452b-9640-429b01dcfff7	produtos	PRODUTO_CRIADO	Produto teste - teste criado	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"nome": "teste", "ativo": true, "linha": "Linha 1", "codigo": "teste", "produtoId": "f78425c5-950e-4ae7-ae72-044ac16a0180"}	2026-04-30 14:27:15.861571-04
74baee19-786c-461d-a928-0a75bd055b59	produtos	PRODUTO_ATUALIZADO	Produto teste novo - teste atualizado	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"antes": {"nome": "teste", "ativo": true, "linha": "Linha 1", "codigo": "teste", "descricao": "teste"}, "depois": {"nome": "teste", "ativo": true, "linha": "Linha 1", "codigo": "teste novo", "descricao": "teste"}, "produtoId": "f78425c5-950e-4ae7-ae72-044ac16a0180"}	2026-04-30 14:27:32.691136-04
30953527-e27c-4732-a1e6-545fc82cb421	produtos	PRODUTO_ATUALIZADO	Produto teste - teste atualizado	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"antes": {"nome": "teste", "ativo": true, "linha": "Linha 1", "codigo": "teste novo", "descricao": "teste"}, "depois": {"nome": "teste", "ativo": true, "linha": "Linha 1", "codigo": "teste", "descricao": "teste"}, "produtoId": "f78425c5-950e-4ae7-ae72-044ac16a0180"}	2026-04-30 14:50:05.545833-04
c8e7eba3-6c2d-4669-b79a-49c20eaf398d	produtos	PRODUTO_EXCLUIDO	Produto teste - teste excluído	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"nome": "teste", "ativo": true, "linha": "Linha 1", "codigo": "teste", "descricao": "teste", "produtoId": "f78425c5-950e-4ae7-ae72-044ac16a0180"}	2026-04-30 14:50:08.637858-04
ebfb8dd6-4203-4e8f-b346-70ebf475f475	produtos	PRODUTO_ATUALIZADO	Produto PRF-014 - Módulo Central Elétrico Aa atualizado	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"antes": {"nome": "Módulo Central Elétrico Aa", "ativo": true, "linha": "Linha 1", "codigo": "PRF-013", "descricao": "Módulo Elétrico de Esteira"}, "depois": {"nome": "Módulo Central Elétrico Aa", "ativo": true, "linha": "Linha 1", "codigo": "PRF-014", "descricao": "Módulo Elétrico de Esteira"}, "produtoId": "7f5a3043-cc60-4601-b89a-09c18114a5bf"}	2026-04-30 15:24:07.209041-04
9b33e853-c4d6-471e-8991-0e61016fdd81	insumos	INSUMO_ADICIONADO	Insumo teste  RJ45 DE REDE adicionado ao lote LOT-2026-00011	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "2bc6f39e-3f1b-4a16-bb69-5d221a99a951", "unidade": "un", "insumoId": "c0de1028-4a64-4c56-881e-729af88faab3", "quantidade": 100, "lote_insumo": "LOT-2026-00011", "nome_insumo": "teste  RJ45 DE REDE", "numero_lote": "LOT-2026-00011", "codigo_insumo": "RJ45 DE REDE"}	2026-04-30 15:27:34.786804-04
bf77c120-346a-4436-8d68-32128266e0c4	produtos	PRODUTO_CRIADO	Produto PRD - 008 - Módulo Elétrico DBC criado	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"nome": "Módulo Elétrico DBC", "ativo": true, "linha": "Linha 1", "codigo": "PRD - 008", "produtoId": "4fcc1a42-7e4f-4bf7-8987-1a67d6f762fe"}	2026-04-30 15:38:40.907579-04
8d8f741a-80f4-414f-9496-90f4f74ef160	insumos	INSUMO_ADICIONADO	Insumo TESTE adicionado ao lote LOT-2026-00016	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "109f658e-95f2-4247-8630-8e94fb349f5e", "unidade": "UN", "insumoId": "5a41969c-f9ec-47b2-baab-c1519349bcf2", "quantidade": 100, "lote_insumo": "TESTE", "nome_insumo": "TESTE", "numero_lote": "LOT-2026-00016", "codigo_insumo": "TESTE"}	2026-04-30 15:40:30.106982-04
0a585959-5649-48a8-8baa-ecce29d9aa34	inspecao	INSPECAO_REGISTRADA	Inspeção registrada no lote LOT-2026-00016	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "109f658e-95f2-4247-8630-8e94fb349f5e", "resultado": "aprovado", "inspecaoId": "99d46f90-cdb4-4860-99da-7e4f7409ee6c", "numero_lote": "LOT-2026-00016", "quantidade_repr": 20, "descricao_desvio": "80 APROVADOS 20 REPROVADO"}	2026-04-30 15:40:58.064219-04
c9a420ea-85b9-4b2f-bf1e-04d276153094	inspecao	INSPECAO_EXCLUIDA	Inspeção excluída do lote LOT-2026-00016	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "109f658e-95f2-4247-8630-8e94fb349f5e", "inspecao": {"id": "99d46f90-cdb4-4860-99da-7e4f7409ee6c", "resultado": "aprovado", "quantidade_repr": 20, "descricao_desvio": "80 APROVADOS 20 REPROVADO"}, "numero_lote": "LOT-2026-00016"}	2026-04-30 15:41:07.230698-04
9ac59d09-539f-4317-87d5-1a01dd82339b	inspecao	INSPECAO_REGISTRADA	Inspeção registrada no lote LOT-2026-00016	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor	{"loteId": "109f658e-95f2-4247-8630-8e94fb349f5e", "resultado": "aprovado_restricao", "inspecaoId": "faee95f8-b077-475c-bbac-04da62724ca7", "numero_lote": "LOT-2026-00016", "quantidade_repr": 20, "descricao_desvio": "80 APROVADOS 20 REPROVADO"}	2026-04-30 15:41:11.63047-04
\.


--
-- Data for Name: inspecao_lote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inspecao_lote (id, resultado, quantidade_repr, descricao_desvio, inspecionado_em, "loteId", "inspetorId") FROM stdin;
0cc0935b-edf0-447e-8666-23513d0a6e1b	aprovado_restricao	3	Pequena não conformidade visual	2026-04-06 19:59:00.351032-04	bde8dd33-a3b8-4ccf-b5b5-4f16a9e812d8	79ad98dc-126c-4368-8343-3f89354e9664
b47b0ffc-9fbf-44be-89e0-3a0f37203647	aprovado_restricao	2	Teste de permissão do inspetor	2026-04-09 14:47:01.019731-04	1f68be82-5d4c-44c3-9c96-17dbe34e4852	79ad98dc-126c-4368-8343-3f89354e9664
c8286b5b-39ff-44be-9b07-963632d83cbd	aprovado_restricao	3	Pequena variação dimensional identificada na inspeção final.	2026-04-27 15:37:42.504441-04	a30707ba-8157-4c53-ace0-acaf782ee9d2	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
8918fc0b-e812-4ceb-996b-4b3925d2417a	aprovado_restricao	10	o botão Excluir inspeção não deve aparecer para inspetor	2026-04-27 17:13:30.307986-04	0050625b-dd14-4e0c-bcae-9354d28e32d6	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
98e8a0f1-530c-48c3-998a-30e138b4839b	aprovado_restricao	10	10 APROVADOS DEPOIS DE RETRABALHO	2026-04-28 20:31:21.339922-04	012cd3ce-19d3-487d-b1b4-b52dc5525f41	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
6059e94c-a1c0-40e8-b15f-8a5ab4f80a54	reprovado	12	SADASD	2026-04-28 20:41:30.976682-04	9ce1b867-1523-456c-b971-122ea8b78a63	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
d9afacfb-35e2-4e37-9611-e5d60a498642	aprovado	0	TODOS APROVADOS	2026-04-30 11:17:27.718069-04	9044267a-fad2-4de6-8048-a58ef1ad3751	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
faee95f8-b077-475c-bbac-04da62724ca7	aprovado_restricao	20	80 APROVADOS 20 REPROVADO	2026-04-30 15:41:11.569995-04	109f658e-95f2-4247-8630-8e94fb349f5e	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
\.


--
-- Data for Name: insumo_lote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumo_lote (id, nome_insumo, codigo_insumo, lote_insumo, quantidade, unidade, "loteId") FROM stdin;
7f446787-0d8a-43f6-9575-1c6053e7ba56	Resina Plástica	INS-001	LINS-2026-001	25	kg	1f68be82-5d4c-44c3-9c96-17dbe34e4852
3a26c98a-1d7d-446b-93f5-b34ce60941ec	Resina ABS	INS-001	LOTE-ABS-2026-01	25	kg	a30707ba-8157-4c53-ace0-acaf782ee9d2
eb7f0837-9647-4856-952e-d4d8a9ef12cb	Resina ABST	INS-002	LOTE-ABS-2026-02	35	kg	0050625b-dd14-4e0c-bcae-9354d28e32d6
92eb16d0-45b6-4d25-b821-852acecc6488	Módulo Esteira Elétrica	PRF - 013NJ	LOTE-PRF-2026-01	31	UN	012cd3ce-19d3-487d-b1b4-b52dc5525f41
bdae9475-15e5-48ad-b682-1b99e5e6da87	Resina ABSTE	INS-003	LOTE-ABS-2026-03	24	UN	9ce1b867-1523-456c-b971-122ea8b78a63
7c5b2524-50d1-49bf-858b-a16d71e0a4ca	Cabo de rede de 1M	Cabo de rede rj45-157	LOTE-RJ45-100	100	UN	9044267a-fad2-4de6-8048-a58ef1ad3751
c0de1028-4a64-4c56-881e-729af88faab3	teste  RJ45 DE REDE	RJ45 DE REDE	LOT-2026-00011	100	un	2bc6f39e-3f1b-4a16-bb69-5d221a99a951
5a41969c-f9ec-47b2-baab-c1519349bcf2	TESTE	TESTE	TESTE	100	UN	109f658e-95f2-4247-8630-8e94fb349f5e
\.


--
-- Data for Name: lotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lotes (id, numero_lote, data_producao, turno, quantidade_prod, quantidade_repr, status, observacoes, aberto_em, encerrado_em, "produtoId", "operadorId") FROM stdin;
93cef64c-5da7-42cf-9daa-9655a23d69d1	LOT-2025-00002	2025-09-01	tarde	150	0	aguardando_inspecao	Aguardando inspeção final	2026-04-06 19:43:12.699118-04	2025-09-02 16:00:00-04	977d6b11-8c63-4aaf-9d7e-e9540f5364b0	b3e660e5-3435-467f-ab95-e6f78bfe299b
fb68584a-2d7c-4e76-bab3-c4030b314983	LOT-2025-00003	2025-09-02	noite	200	2	aprovado	Lote aprovado	2026-04-06 19:43:12.699118-04	2025-09-03 23:00:00-04	ef60bb77-9a3a-4ebe-8f83-d0da96d08010	b3e660e5-3435-467f-ab95-e6f78bfe299b
fe97af45-67fd-4501-9e7b-4046eb8f1a5a	LOT-2025-00004	2025-09-03	manha	120	5	aprovado_restricao	Aprovado com restrição	2026-04-06 19:43:12.699118-04	2025-09-04 11:30:00-04	fb310819-a37c-4296-8724-67133f2b0f1c	b3e660e5-3435-467f-ab95-e6f78bfe299b
64115cf5-175a-4d4d-b5ae-1ded32fcf277	LOT-2025-00005	2025-09-04	tarde	90	10	reprovado	Reprovado por não conformidade	2026-04-06 19:43:12.699118-04	2025-09-05 17:20:00-04	977d6b11-8c63-4aaf-9d7e-e9540f5364b0	b3e660e5-3435-467f-ab95-e6f78bfe299b
bde8dd33-a3b8-4ccf-b5b5-4f16a9e812d8	LOT-2025-00001	2025-08-31	manha	100	3	aprovado_restricao	Lote em produção	2026-04-06 19:43:12.699118-04	2026-04-06 19:59:00.381-04	fb310819-a37c-4296-8724-67133f2b0f1c	b3e660e5-3435-467f-ab95-e6f78bfe299b
2b85a3de-4f88-4b35-b374-432f865429d7	LOT-2026-00007	2026-04-06	manha	100	0	em_producao	Teste permissão operador	2026-04-09 14:36:38.009495-04	\N	fb310819-a37c-4296-8724-67133f2b0f1c	b3e660e5-3435-467f-ab95-e6f78bfe299b
1f68be82-5d4c-44c3-9c96-17dbe34e4852	LOT-2026-00006	2026-04-05	manha	180	2	aprovado_restricao	Lote para teste de insumos	2026-04-06 20:59:12.522369-04	2026-04-09 14:47:01.046-04	fb310819-a37c-4296-8724-67133f2b0f1c	b3e660e5-3435-467f-ab95-e6f78bfe299b
a30707ba-8157-4c53-ace0-acaf782ee9d2	LOT-2026-00008	2026-04-08	noite	50	3	aprovado_restricao	aprovado com inatividade	2026-04-09 20:40:01.18416-04	2026-04-27 15:37:42.532-04	da50a73e-f333-4f9f-8a56-8822ee729374	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
0050625b-dd14-4e0c-bcae-9354d28e32d6	LOT-2026-00009	2026-04-26	noite	25	10	aprovado_restricao		2026-04-27 16:13:45.323577-04	2026-04-27 17:13:30.316-04	431b8d92-0961-4d24-a92a-04f03b0bf233	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
012cd3ce-19d3-487d-b1b4-b52dc5525f41	LOT-2026-00013	2026-04-27	manha	30	10	aprovado_restricao	Produzido 20 unidas com aprovação direta, e 10 com retrabalho.	2026-04-28 20:28:37.270518-04	2026-04-28 20:31:21.359-04	7f5a3043-cc60-4601-b89a-09c18114a5bf	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
9ce1b867-1523-456c-b971-122ea8b78a63	LOT-2026-00015	2026-04-27	manha	24	12	reprovado	SDASDASD	2026-04-28 20:40:30.476747-04	2026-04-28 20:41:30.988-04	02f826b1-464f-4905-b154-c96b52c4a009	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
4e0ce40c-15d3-466a-a329-a833b4ae49b5	LOT-2026-00010	2026-04-28	manha	20	0	aguardando_inspecao	FOI PRODUZINHO NA IMPRESSORA 3D	2026-04-28 09:49:37.455812-04	\N	62c9bcf0-c89b-4aac-aea7-711f4e0e1e97	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
317afe26-37a0-40b5-82df-6c7d8b6079db	LOT-2026-00014	2026-04-27	noite	12	0	aguardando_inspecao	SADFASFSF	2026-04-28 20:35:31.508242-04	\N	7f5a3043-cc60-4601-b89a-09c18114a5bf	b3e660e5-3435-467f-ab95-e6f78bfe299b
9044267a-fad2-4de6-8048-a58ef1ad3751	LOT-2026-00012	2026-04-28	manha	10	0	aprovado	INICIO	2026-04-28 09:51:11.791539-04	2026-04-30 11:17:27.747-04	62c9bcf0-c89b-4aac-aea7-711f4e0e1e97	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
2bc6f39e-3f1b-4a16-bb69-5d221a99a951	LOT-2026-00011	2026-04-28	noite	400	0	em_producao	PRODUZIDO MAIS 40 DEPOIS REGULAR MÁQUINA	2026-04-28 09:50:23.037055-04	\N	62c9bcf0-c89b-4aac-aea7-711f4e0e1e97	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
109f658e-95f2-4247-8630-8e94fb349f5e	LOT-2026-00016	2026-04-29	manha	100	20	aprovado_restricao	TESTE	2026-04-30 15:39:51.967906-04	2026-04-30 15:41:11.585-04	4fcc1a42-7e4f-4bf7-8987-1a67d6f762fe	fa54541d-029a-4b84-a3aa-f80b9a3dd2b4
\.


--
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id, codigo, nome, descricao, linha, ativo) FROM stdin;
fb310819-a37c-4296-8724-67133f2b0f1c	PRD-001	Placa Eletrônica A	Placa principal do equipamento	Linha 1	t
977d6b11-8c63-4aaf-9d7e-e9540f5364b0	PRD-002	Módulo Sensor B	Módulo de leitura e monitoramento	Linha 2	t
ef60bb77-9a3a-4ebe-8f83-d0da96d08010	PRD-003	Painel de Controle C	Painel frontal de operação	Linha 1	t
da50a73e-f333-4f9f-8a56-8822ee729374	PRD - 004	Módulo Elétrico D	Nenhuma no momento	Linha 2	t
431b8d92-0961-4d24-a92a-04f03b0bf233	PRD - 005	Módulo Elétrico AB		Linha 2	t
62c9bcf0-c89b-4aac-aea7-711f4e0e1e97	PDV-R25J	RJ45 DE REDE	CABO DE REDE	Linha 1	t
02f826b1-464f-4905-b154-c96b52c4a009	PRD - 007	Módulo Elétrico ABC	DSAASA	Linha 2	t
7f5a3043-cc60-4601-b89a-09c18114a5bf	PRF-014	Módulo Central Elétrico Aa	Módulo Elétrico de Esteira	Linha 1	t
4fcc1a42-7e4f-4bf7-8987-1a67d6f762fe	PRD - 008	Módulo Elétrico DBC	TESTE	Linha 1	t
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nome, email, senha, perfil, criado_em, ativo) FROM stdin;
b3e660e5-3435-467f-ab95-e6f78bfe299b	Operador Teste	operador@lotepath.com	$2b$10$Tx.vZq/46wGUNxRE1L69ouO214YErT8uPmo1kdQRuv4zeS6whtsSK	operador	2026-04-06 19:43:12.671203	t
79ad98dc-126c-4368-8343-3f89354e9664	Inspetor Teste	inspetor@lotepath.com	$2b$10$Tx.vZq/46wGUNxRE1L69ouO214YErT8uPmo1kdQRuv4zeS6whtsSK	inspetor	2026-04-06 19:43:12.671203	t
fa54541d-029a-4b84-a3aa-f80b9a3dd2b4	Gestor Teste	gestor@lotepath.com	$2b$10$7f8DUv6.sMXshHhbAfpEdutQdFmFVp0p2aLpktn.uuRLxUpPL7svi	gestor	2026-04-09 20:02:58.413049	t
\.


--
-- Name: inspecao_lote PK_0b891b8d62e77e4f0a50d8c19bf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspecao_lote
    ADD CONSTRAINT "PK_0b891b8d62e77e4f0a50d8c19bf" PRIMARY KEY (id);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: lotes PK_6eda564423c09706b95cbf8ae1c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes
    ADD CONSTRAINT "PK_6eda564423c09706b95cbf8ae1c" PRIMARY KEY (id);


--
-- Name: produtos PK_a5d976312809192261ed96174f3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT "PK_a5d976312809192261ed96174f3" PRIMARY KEY (id);


--
-- Name: insumo_lote PK_b1bfea2a0efadb2efaff8e2571d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo_lote
    ADD CONSTRAINT "PK_b1bfea2a0efadb2efaff8e2571d" PRIMARY KEY (id);


--
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- Name: inspecao_lote REL_bfaaba86609c209edd1de2ffd2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspecao_lote
    ADD CONSTRAINT "REL_bfaaba86609c209edd1de2ffd2" UNIQUE ("loteId");


--
-- Name: produtos UQ_34a50528dbd79d5c6481c932c94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT "UQ_34a50528dbd79d5c6481c932c94" UNIQUE (codigo);


--
-- Name: usuarios UQ_446adfc18b35418aac32ae0b7b5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE (email);


--
-- Name: lotes UQ_af19a064c331e76c7ed1993c6dd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes
    ADD CONSTRAINT "UQ_af19a064c331e76c7ed1993c6dd" UNIQUE (numero_lote);


--
-- Name: lotes FK_0e116de64fadb75d7c4d826c0bc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes
    ADD CONSTRAINT "FK_0e116de64fadb75d7c4d826c0bc" FOREIGN KEY ("operadorId") REFERENCES public.usuarios(id);


--
-- Name: insumo_lote FK_34156df5244d34b189659cec0b3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo_lote
    ADD CONSTRAINT "FK_34156df5244d34b189659cec0b3" FOREIGN KEY ("loteId") REFERENCES public.lotes(id) ON DELETE CASCADE;


--
-- Name: lotes FK_4167be7fc16a00653c8fc0d9bd2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lotes
    ADD CONSTRAINT "FK_4167be7fc16a00653c8fc0d9bd2" FOREIGN KEY ("produtoId") REFERENCES public.produtos(id);


--
-- Name: inspecao_lote FK_ae23a0f560f90df019655210488; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspecao_lote
    ADD CONSTRAINT "FK_ae23a0f560f90df019655210488" FOREIGN KEY ("inspetorId") REFERENCES public.usuarios(id);


--
-- Name: inspecao_lote FK_bfaaba86609c209edd1de2ffd28; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspecao_lote
    ADD CONSTRAINT "FK_bfaaba86609c209edd1de2ffd28" FOREIGN KEY ("loteId") REFERENCES public.lotes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict BJEY5mM3fuiGW4TSolzurAGSyFKsqWl5TKtqVIcZcZMOegnJksyc0aqAZ3woFPi

