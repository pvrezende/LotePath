import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  Usuario,
} from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsuarios(): Observable<{ status: number; data: Usuario[] }> {
    return this.http.get<{ status: number; data: Usuario[] }>(
      `${this.apiUrl}/usuarios`
    );
  }

  createUsuario(data: CreateUsuarioRequest): Observable<{ usuario: Usuario }> {
    return this.http.post<{ usuario: Usuario }>(`${this.apiUrl}/usuarios`, data);
  }

  updateUsuario(
    id: string,
    data: UpdateUsuarioRequest
  ): Observable<{ usuario: Usuario }> {
    return this.http.put<{ usuario: Usuario }>(
      `${this.apiUrl}/usuarios/${id}`,
      data
    );
  }

  deleteUsuario(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/usuarios/${id}`);
  }
}
