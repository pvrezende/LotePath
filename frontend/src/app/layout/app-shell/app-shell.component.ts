import { Component, HostListener, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PermissionService } from '../../core/services/permission.service';

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

          @if (canManageProdutos) {
            <a
              routerLink="/app/produtos"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMobileMenu()"
            >
              <span class="nav-icon">🏷️</span>
              <span>Produtos</span>
            </a>
          }

          <a
            routerLink="/app/lotes"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">📦</span>
            <span>Lotes</span>
          </a>

          @if (canManageInsumos) {
            <a
              routerLink="/app/insumos"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMobileMenu()"
            >
              <span class="nav-icon">🧩</span>
              <span>Insumos</span>
            </a>
          }

          @if (canInspectLotes) {
            <a
              routerLink="/app/inspecao"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMobileMenu()"
            >
              <span class="nav-icon">✅</span>
              <span>Inspeção</span>
            </a>
          }

          <a
            routerLink="/app/rastreabilidade"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">🔎</span>
            <span>Rastreabilidade</span>
          </a>

          @if (canManageUsuarios) {
            <a
              routerLink="/app/usuarios"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMobileMenu()"
            >
              <span class="nav-icon">👥</span>
              <span>Usuários</span>
            </a>
          }
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
            <span class="current-page-label">Tela atual</span>
            <strong>{{ currentPageTitle }}</strong>
            <span>Sistema de rastreamento de produção</span>
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
        display: block;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 30%),
          linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
      }

      .sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        width: 280px;
        height: 100vh;
        height: 100dvh;
        padding: 16px;
        background: rgba(255, 255, 255, 0.92);
        border-right: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 14px 0 40px rgba(15, 23, 42, 0.06);
        display: flex;
        flex-direction: column;
        gap: 18px;
        z-index: 50;
        transition: box-shadow 0.2s ease;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .sidebar:hover {
        box-shadow: 18px 0 50px rgba(15, 23, 42, 0.08);
      }

      .sidebar-brand,
      .sidebar-nav,
      .sidebar-footer {
        width: 100%;
        box-sizing: border-box;
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
        width: 190px;
        max-width: 100%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(0 14px 24px rgba(15, 23, 42, 0.14));
      }

      .sidebar-title h1 {
        margin: 8px 0 2px;
        color: #0f172a;
        font-size: 26px;
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
        align-items: stretch;
      }

      .sidebar-nav a {
        width: 100%;
        min-height: 48px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 14px;
        border-radius: 16px;
        color: #475569;
        font-size: 15px;
        font-weight: 800;
        box-sizing: border-box;
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
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
        align-items: stretch;
        padding-top: 10px;
      }

      .user-card {
        width: 100%;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        box-sizing: border-box;
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
        box-sizing: border-box;
      }

      .main-area {
        min-width: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        margin-left: 280px;
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

      .current-page-label {
        color: #2563eb;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .topbar-title strong {
        color: #0f172a;
        font-size: 22px;
        font-weight: 900;
        letter-spacing: -0.03em;
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
        padding: 16px;
      }

      .mobile-backdrop {
        display: none;
      }

      @media (max-width: 1280px) {
        .sidebar {
          width: 250px;
          padding: 12px;
          gap: 14px;
        }

        .main-area {
          margin-left: 250px;
        }

        .sidebar-footer {
          padding-top: 8px;
        }

        .sidebar-brand {
          padding: 14px 12px;
          border-radius: 20px;
        }

        .sidebar-logo {
          width: 150px;
        }

        .sidebar-title h1 {
          font-size: 24px;
        }

        .sidebar-title p {
          font-size: 12px;
        }

        .sidebar-nav a {
          min-height: 44px;
          padding: 0 12px;
          font-size: 14px;
        }

        .nav-icon {
          width: 26px;
          height: 26px;
          font-size: 14px;
        }

        .topbar {
          margin: 12px 12px 0;
        }

        .content-area {
          padding: 12px;
        }
      }

      @media (max-width: 1100px) {
        .main-area {
          margin-left: 0;
        }

        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: min(310px, calc(100vw - 30px));
          height: 100vh;
          height: 100dvh;
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
          min-height: 64px;
          padding: 12px 14px;
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
  private permissionService = inject(PermissionService);

  mobileMenuOpen = false;

  readonly user = this.authService.getUser();

  get userName(): string {
    return this.user?.nome ?? 'Usuário';
  }

  get userPerfil(): string {
    return this.user?.perfil ?? 'perfil';
  }

  get currentPageTitle(): string {
    const url = this.router.url;

    if (url.includes('/app/produtos')) return 'Produtos';
    if (url.includes('/app/lotes')) return 'Lotes';
    if (url.includes('/app/insumos')) return 'Insumos';
    if (url.includes('/app/inspecao')) return 'Inspeção';
    if (url.includes('/app/rastreabilidade')) return 'Rastreabilidade';
    if (url.includes('/app/usuarios')) return 'Usuários';
    if (url.includes('/app/dashboard')) return 'Dashboard';

    return 'LotePath';
  }

  get canManageProdutos(): boolean {
    return this.permissionService.hasPermission('canManageProdutos');
  }

  get canManageInsumos(): boolean {
    return this.permissionService.hasPermission('canManageInsumos');
  }

  get canInspectLotes(): boolean {
    return this.permissionService.hasPermission('canInspectLotes');
  }

  get canManageUsuarios(): boolean {
    return this.permissionService.hasPermission('canManageUsuarios');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 1100 && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
