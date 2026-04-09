import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5336';

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, data)
      .pipe(
        tap((response) => {
          localStorage.setItem('lotepath.token', response.token);
          localStorage.setItem('lotepath.user', JSON.stringify(response.usuario));
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('lotepath.token');
  }

  getUser(): LoginResponse['usuario'] | null {
    const user = localStorage.getItem('lotepath.user');

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('lotepath.token');
    localStorage.removeItem('lotepath.user');
  }
}
