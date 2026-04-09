export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  perfil: 'operador' | 'inspetor' | 'gestor';
}

export interface LoginResponse {
  usuario: AuthUser;
  token: string;
}
