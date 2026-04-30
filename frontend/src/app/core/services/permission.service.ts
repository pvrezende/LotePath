import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { PERMISSIONS, UserPerfil } from '../models/permissions.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private authService = inject(AuthService);

  get perfil(): UserPerfil | null {
    return this.authService.getUser()?.perfil ?? null;
  }

  hasPermission(permission: keyof typeof PERMISSIONS): boolean {
    const perfil = this.perfil;

    if (!perfil) {
      return false;
    }

    const allowedProfiles = PERMISSIONS[permission] as readonly UserPerfil[];

    return allowedProfiles.includes(perfil);
  }

  isGestor(): boolean {
    return this.perfil === 'gestor';
  }

  isOperador(): boolean {
    return this.perfil === 'operador';
  }

  isInspetor(): boolean {
    return this.perfil === 'inspetor';
  }
}
