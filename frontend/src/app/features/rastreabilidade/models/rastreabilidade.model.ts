export interface RastreabilidadeLoteResponse {
  lote: {
    id: string;
    numero_lote: string;
    data_producao: string;
    turno: 'manha' | 'tarde' | 'noite';
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
    inspecao?: {
      id: string;
      resultado: 'aprovado' | 'aprovado_restricao' | 'reprovado';
      quantidade_repr: number;
      descricao_desvio: string | null;
      inspecionado_em: string;
      loteId: string;
      inspetorId: string;
    } | null;
    insumos?: {
      id: string;
      nome_insumo: string;
      codigo_insumo: string;
      lote_insumo: string;
      quantidade: number;
      unidade: string;
    }[];
  };
}

export interface RastreabilidadeInsumoResponse {
  insumo: {
    nome_insumo: string;
    codigo_insumo: string;
    lote_insumo: string;
  };
  lotesAfetados: {
    id: string;
    numero_lote: string;
    data_producao: string;
    status:
      | 'em_producao'
      | 'aguardando_inspecao'
      | 'aprovado'
      | 'aprovado_restricao'
      | 'reprovado';
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
  }[];
}
