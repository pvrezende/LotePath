import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-main">
          <div class="brand-area">
            <div class="brand-text">
              <h1>LotePath</h1>
              <p>Sistema de rastreamento por lotes</p>
            </div>
          </div>

          <div class="topbar-actions">
            <div class="user-info">
              <strong>{{ userName }}</strong>
              <span>{{ userPerfil }}</span>
            </div>

            <button type="button" (click)="logout()">Sair</button>
          </div>
        </div>

        <nav class="nav-menu">
          <a
            routerLink="/app/dashboard"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            Dashboard
          </a>

          <a
            routerLink="/app/produtos"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            Produtos
          </a>

          <a
            routerLink="/app/lotes"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            Lotes
          </a>
        </nav>
      </header>

      <main class="content">
        <router-outlet />
      </main>

      <footer class="footer">
        <p>Projeto acadêmico INDT • LotePath • Frontend Angular</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
        background: #f3f6fb;
        display: flex;
        flex-direction: column;
      }

      .topbar {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 18px 24px;
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .topbar-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .brand-area {
        display: flex;
        align-items: center;
        min-width: 0;
      }

      .brand-text h1 {
        font-size: 30px;
        margin-bottom: 4px;
        color: #0f172a;
        line-height: 1.1;
      }

      .brand-text p {
        color: #64748b;
        font-size: 14px;
        line-height: 1.4;
      }

      .nav-menu {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .nav-menu a {
        padding: 10px 14px;
        border-radius: 10px;
        color: #475569;
        font-weight: 600;
        transition: 0.2s ease;
        white-space: nowrap;
      }

      .nav-menu a:hover {
        background: #eff6ff;
        color: #1d4ed8;
      }

      .active-link {
        background: #dbeafe;
        color: #1d4ed8 !important;
      }

      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-shrink: 0;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.2;
      }

      .user-info strong {
        color: #0f172a;
      }

      .user-info span {
        font-size: 13px;
        color: #64748b;
        text-transform: capitalize;
      }

      button {
        height: 42px;
        padding: 0 18px;
        border: none;
        border-radius: 10px;
        background: #dc2626;
        color: white;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s ease;
        white-space: nowrap;
      }

      button:hover {
        background: #b91c1c;
      }

      .content {
        flex: 1;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 28px 24px;
      }

      .footer {
        border-top: 1px solid #e5e7eb;
        background: #ffffff;
        padding: 16px 24px;
        text-align: center;
        color: #64748b;
        font-size: 14px;
      }

      @media (max-width: 900px) {
        .topbar-main {
          align-items: flex-start;
          flex-direction: column;
        }

        .topbar-actions {
          width: 100%;
          justify-content: space-between;
        }

        .user-info {
          align-items: flex-start;
        }
      }

      @media (max-width: 640px) {
        .topbar {
          padding: 16px;
          gap: 12px;
        }

        .brand-text h1 {
          font-size: 24px;
        }

        .brand-text p {
          font-size: 13px;
        }

        .nav-menu {
          gap: 8px;
        }

        .nav-menu a {
          padding: 9px 12px;
          font-size: 14px;
        }

        .topbar-actions {
          gap: 12px;
        }

        .user-info strong {
          font-size: 14px;
        }

        .user-info span {
          font-size: 12px;
        }

        button {
          height: 40px;
          padding: 0 14px;
          font-size: 14px;
        }

        .content {
          padding: 18px 14px;
        }

        .footer {
          padding: 14px 16px;
          font-size: 13px;
        }
      }

      @media (max-width: 420px) {
        .nav-menu {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          width: 100%;
        }

        .nav-menu a {
          text-align: center;
        }

        .topbar-actions {
          flex-direction: row;
          align-items: center;
        }

        .user-info {
          min-width: 0;
        }

        .user-info strong,
        .user-info span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }
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
