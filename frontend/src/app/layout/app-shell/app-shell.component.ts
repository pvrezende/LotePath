import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <h1>LotePath</h1>
          <p>Sistema de rastreamento por lotes</p>
        </div>

        <div class="topbar-actions">
          <div class="user-info">
            <strong>{{ userName }}</strong>
            <span>{{ userPerfil }}</span>
          </div>

          <button type="button" (click)="logout()">Sair</button>
        </div>
      </header>

      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
        background: #f5f7fb;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px;
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;
      }

      .topbar h1 {
        font-size: 28px;
        margin-bottom: 4px;
      }

      .topbar p {
        color: #6b7280;
      }

      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .user-info span {
        font-size: 13px;
        color: #6b7280;
        text-transform: capitalize;
      }

      button {
        height: 40px;
        padding: 0 16px;
        border: none;
        border-radius: 10px;
        background: #dc2626;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }

      .content {
        padding: 24px;
      }
    `,
  ],
})
export class AppShellComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly user = this.authService.getUser();

  get userName(): string {
    return this.user?.nome ?? 'Usuário';
  }

  get userPerfil(): string {
    return this.user?.perfil ?? 'perfil';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
