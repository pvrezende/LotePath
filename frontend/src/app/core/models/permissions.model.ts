export type UserPerfil = 'operador' | 'inspetor' | 'gestor';

export const PERMISSIONS = {
  canManageProdutos: ['gestor'],
  canCreateLotes: ['operador', 'gestor'],
  canEditLotes: ['gestor'],
  canDeleteLotes: ['gestor'],
  canManageInsumos: ['operador', 'gestor'],
  canInspectLotes: ['inspetor', 'gestor'],
  canDeleteInspecao: ['gestor'],
  canManageUsuarios: ['gestor'],
  canViewAuditoria: ['gestor'],
} satisfies Record<string, UserPerfil[]>;
