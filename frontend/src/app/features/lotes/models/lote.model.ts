export type Turno = 'manha' | 'tarde' | 'noite';

export interface Lote {
  id: string;
  numero_lote: string;
  data_producao: string;
  turno: Turno;
  quantidade_prod: number;
  quantidade_repr: number;
  status:
    | 'em_producao'
    | 'aguardando_inspecao'
    | 'aprovado'
    | 'aprovado_restricao'
    | 'reprovado';
  observacoes: string | null;
  encerrado_em: string | null;
  produto: {
    id: string;
    codigo: string;
    nome: string;
    linha: string;
  };
  operador: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
}

export interface CreateLoteRequest {
  produtoId: string;
  data_producao: string;
  turno: Turno;
  operadorId: string;
  quantidade_prod: number;
  observacoes?: string | null;
}
