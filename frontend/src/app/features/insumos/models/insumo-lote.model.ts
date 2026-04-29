export interface InsumoLote {
  id: string;
  nome_insumo: string;
  codigo_insumo: string;
  lote_insumo: string;
  quantidade: number;
  unidade: string;
}

export interface AddInsumoLoteRequest {
  nome_insumo: string;
  codigo_insumo: string;
  lote_insumo: string;
  quantidade: number;
  unidade: string;
}
