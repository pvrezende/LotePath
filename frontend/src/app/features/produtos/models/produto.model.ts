export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  linha: string;
  ativo: boolean;
}

export interface CreateProdutoRequest {
  codigo: string;
  nome: string;
  descricao?: string | null;
  linha: string;
  ativo: boolean;
}
