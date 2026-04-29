export type UsuarioPerfil = 'operador' | 'inspetor' | 'gestor';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: UsuarioPerfil;
  criado_em: string;
}

export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  perfil: UsuarioPerfil;
}
