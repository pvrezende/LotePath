export type UsuarioPerfil = 'operador' | 'inspetor' | 'gestor';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: UsuarioPerfil;
  ativo: boolean;
  criado_em: string;
}

export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  perfil: UsuarioPerfil;
  ativo?: boolean;
}

export interface UpdateUsuarioRequest {
  nome?: string;
  email?: string;
  senha?: string;
  perfil?: UsuarioPerfil;
  ativo?: boolean;
}
