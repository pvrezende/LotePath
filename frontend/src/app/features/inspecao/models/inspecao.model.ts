export type ResultadoInspecao =
  | 'aprovado'
  | 'aprovado_restricao'
  | 'reprovado';

export interface Inspecao {
  id: string;
  resultado: ResultadoInspecao;
  quantidade_repr: number;
  descricao_desvio: string | null;
  inspecionado_em: string;
  inspetorId: string;
  loteId: string;
}

export interface CreateInspecaoRequest {
  resultado: ResultadoInspecao;
  quantidade_repr: number;
  descricao_desvio?: string | null;
}
