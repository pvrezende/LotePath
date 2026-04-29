export interface AuditLog {
  id: string;
  modulo: 'insumos' | 'inspecao' | string;
  acao: string;
  descricao: string;
  usuario_id: string | null;
  usuario_nome: string | null;
  usuario_perfil: string | null;
  detalhes: Record<string, unknown> | null;
  criado_em: string;
}

export interface AuditLogResponse {
  status: number;
  data: AuditLog[];
}
