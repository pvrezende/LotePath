export type LoteStatus =
  | 'em_producao'
  | 'aguardando_inspecao'
  | 'aprovado'
  | 'aprovado_restricao'
  | 'reprovado';

export interface DashboardIndicadores {
  lotesProduzidosHoje: number;
  unidadesProduzidasHoje: number;
  taxaAprovacaoMes: number;
  lotesAguardandoInspecao: number;
}

export interface DashboardLote {
  id: string;
  numero_lote: string;
  produto: string;
  operador: string;
  data_producao: string;
  status: LoteStatus;
}

export interface DashboardResponse {
  indicadores: DashboardIndicadores;
  ultimosLotes: DashboardLote[];
}
