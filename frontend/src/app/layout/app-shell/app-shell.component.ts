import { Component, HostListener, inject } from '@angular/core';
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
      <aside class="sidebar" [class.mobile-open]="mobileMenuOpen">
        <div class="sidebar-brand">
          <img
            src="/assets/imagens/Lotepath.png"
            alt="Logo LotePath"
            class="sidebar-logo"
          />

          <div class="sidebar-title">
            <h1>LotePath</h1>
            <p>Rastreamento por lotes</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a
            routerLink="/app/dashboard"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>

          <a
            routerLink="/app/produtos"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">🏷️</span>
            <span>Produtos</span>
          </a>

          <a
            routerLink="/app/lotes"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">📦</span>
            <span>Lotes</span>
          </a>

          <a
            routerLink="/app/insumos"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">🧩</span>
            <span>Insumos</span>
          </a>

          <a
            routerLink="/app/inspecao"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">✅</span>
            <span>Inspeção</span>
          </a>

          <a
            routerLink="/app/rastreabilidade"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">🔎</span>
            <span>Rastreabilidade</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card">
            <small>Usuário logado</small>
            <strong>{{ userName }}</strong>
            <span>{{ userPerfil }}</span>
          </div>

          <button type="button" class="logout-btn" (click)="logout()">
            Sair
          </button>
        </div>
      </aside>

      @if (mobileMenuOpen) {
        <div class="mobile-backdrop" (click)="closeMobileMenu()"></div>
      }

      <section class="main-area">
        <header class="topbar">
          <button
            type="button"
            class="mobile-menu-btn"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen"
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div class="topbar-title">
            <strong>Sistema de rastreamento de produção</strong>
            <span>Controle produtivo, inspeção, insumos e recall</span>
          </div>

          <div class="topbar-user">
            <div>
              <small>{{ userPerfil }}</small>
              <strong>{{ userName }}</strong>
            </div>
          </div>
        </header>

        <main class="content-area">
          <router-outlet />
        </main>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .app-shell {
        min-height: 100vh;
        width: 100%;
        display: grid;
        grid-template-columns: 300px minmax(0, 1fr);
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 30%),
          linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
      }

      .sidebar {
        position: sticky;
        top: 0;
        height: 100vh;
        padding: 16px;
        background: rgba(255, 255, 255, 0.92);
        border-right: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 14px 0 40px rgba(15, 23, 42, 0.06);
        display: flex;
        flex-direction: column;
        gap: 18px;
        z-index: 50;
        transition: box-shadow 0.2s ease;
      }

      .sidebar:hover {
        box-shadow: 18px 0 50px rgba(15, 23, 42, 0.08);
      }

      .sidebar-brand {
        background:
          radial-gradient(circle at top right, rgba(20, 184, 166, 0.14), transparent 34%),
          linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        padding: 18px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.06);
      }

      .sidebar-logo {
        width: 210px;
        max-width: 100%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(0 14px 24px rgba(15, 23, 42, 0.14));
      }

      .sidebar-title h1 {
        margin: 8px 0 2px;
        color: #0f172a;
        font-size: 28px;
        line-height: 1;
        font-weight: 900;
        letter-spacing: -0.04em;
      }

      .sidebar-title p {
        margin: 0;
        color: #64748b;
        font-size: 13px;
        font-weight: 600;
      }

      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .sidebar-nav a {
        min-height: 48px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 14px;
        border-radius: 16px;
        color: #475569;
        font-size: 15px;
        font-weight: 800;
        transition:
          background-color 0.2s ease,
          color 0.2s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .sidebar-nav a:hover {
        background: #eff6ff;
        color: #1d4ed8;
        transform: translateX(2px);
      }

      .nav-icon {
        width: 28px;
        height: 28px;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        font-size: 15px;
        flex-shrink: 0;
      }

      .active-link {
        background: linear-gradient(135deg, #25b5ee 0%, #25b5ee 100%);
        color: #ffffff !important;
        box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
      }

      .active-link .nav-icon {
        background: rgba(255, 255, 255, 0.18);
      }

      .sidebar-footer {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .user-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .user-card small,
      .topbar-user small {
        color: #94a3b8;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .user-card strong,
      .topbar-user strong {
        color: #0f172a;
        font-size: 15px;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-card span {
        color: #64748b;
        font-size: 13px;
        text-transform: capitalize;
      }

      .logout-btn {
        min-height: 46px;
        width: 100%;
        border-radius: 14px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: #ffffff;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 12px 24px rgba(220, 38, 38, 0.18);
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          filter 0.18s ease;
      }

      .logout-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 16px 30px rgba(220, 38, 38, 0.24);
        filter: saturate(1.04);
      }

      .main-area {
        min-width: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .topbar {
        position: sticky;
        top: 0;
        z-index: 30;
        min-height: 74px;
        margin: 16px 16px 0;
        padding: 14px 18px;
        background: rgba(255, 255, 255, 0.86);
        border: none;
        border-radius: 22px;
        box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .topbar-title {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .topbar-title strong {
        color: #0f172a;
        font-size: 18px;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .topbar-title span {
        color: #64748b;
        font-size: 13px;
      }

      .topbar-user {
        min-width: 180px;
        display: flex;
        justify-content: flex-end;
      }

      .topbar-user div {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        max-width: 240px;
      }

      .mobile-menu-btn {
        display: none;
        width: 46px;
        height: 46px;
        border-radius: 14px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        flex-shrink: 0;
      }

      .mobile-menu-btn span {
        width: 19px;
        height: 2px;
        border-radius: 999px;
        background: #0f172a;
        display: block;
      }

      .content-area {
        flex: 1;
        width: 100%;
        min-width: 0;
        padding: 20px;
      }

      .mobile-backdrop {
        display: none;
      }

      @media (max-width: 1180px) {
        .app-shell {
          grid-template-columns: 280px minmax(0, 1fr);
        }

        .sidebar-logo {
          width: 190px;
        }
      }

      @media (max-width: 920px) {
        .app-shell {
          display: block;
        }

        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: min(320px, calc(100vw - 34px));
          transform: translateX(-104%);
          transition: transform 0.24s ease, box-shadow 0.2s ease;
          border-right: 1px solid #e2e8f0;
        }

        .sidebar.mobile-open {
          transform: translateX(0);
        }

        .mobile-backdrop {
          display: block;
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }

        .mobile-menu-btn {
          display: inline-flex;
        }

        .topbar {
          margin: 10px 10px 0;
          border-radius: 18px;
        }

        .topbar-user {
          display: none;
        }

        .content-area {
          padding: 12px;
        }
      }

      @media (max-width: 560px) {
        .topbar {
          align-items: flex-start;
        }

        .topbar-title strong {
          font-size: 16px;
        }

        .topbar-title span {
          font-size: 12px;
        }

        .sidebar {
          padding: 12px;
        }

        .sidebar-brand {
          padding: 14px;
        }

        .sidebar-logo {
          width: 170px;
        }
      }
    `,
  ],
})
export class AppShellComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  mobileMenuOpen = false;

  readonly user = this.authService.getUser();

  get userName(): string {
    return this.user?.nome ?? 'Usuário';
  }

  get userPerfil(): string {
    return this.user?.perfil ?? 'perfil';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 920 && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
