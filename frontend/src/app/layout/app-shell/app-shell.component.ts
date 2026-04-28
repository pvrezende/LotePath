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
      <header class="topbar">
        <div class="topbar-inner">
          <div class="topbar-main">
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

            <div class="brand-area">
              <div class="brand-mark">
                <span class="brand-mark-core"></span>
              </div>

              <div class="brand-text">
                <h1>LotePath</h1>
                <p>Sistema de rastreamento por lotes</p>
              </div>
            </div>

            <div class="topbar-actions desktop-user-area">
              <div class="user-info">
                <small class="user-label">Usuário logado</small>
                <strong>{{ userName }}</strong>
                <span>{{ userPerfil }}</span>
              </div>

              <button type="button" class="logout-btn" (click)="logout()">
                Sair
              </button>
            </div>
          </div>

          <div class="topbar-divider"></div>

          <div class="nav-wrapper" [class.mobile-open]="mobileMenuOpen">
            <nav class="nav-menu">
              <a
                routerLink="/app/dashboard"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobileMenu()"
              >
                Dashboard
              </a>

              <a
                routerLink="/app/produtos"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobileMenu()"
              >
                Produtos
              </a>

              <a
                routerLink="/app/lotes"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobileMenu()"
              >
                Lotes
              </a>

              <a
                routerLink="/app/insumos"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobileMenu()"
              >
                Insumos
              </a>

              <a
                routerLink="/app/inspecao"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobileMenu()"
              >
                Inspeção
              </a>

              <a
                routerLink="/app/rastreabilidade"
                routerLinkActive="active-link"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobileMenu()"
              >
                Rastreabilidade
              </a>
            </nav>

            <div class="topbar-actions mobile-user-area">
              <div class="user-info">
                <small class="user-label">Usuário logado</small>
                <strong>{{ userName }}</strong>
                <span>{{ userPerfil }}</span>
              </div>

              <button type="button" class="logout-btn" (click)="logout()">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="content-area">
        <div class="content-shell">
          <router-outlet />
        </div>
      </main>

      <footer class="footer">
        <div class="footer-inner">
          <p>Projeto acadêmico INDT • LotePath • Frontend Angular</p>
          <span class="footer-badge">Controle produtivo e rastreabilidade</span>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .app-shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .topbar {
        position: relative;
        z-index: 1;
        padding: 18px 20px 0;
      }

      .topbar-inner {
        max-width: 1480px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 26px;
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
        padding: 18px 22px 16px;
      }
            .topbar-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .topbar-divider {
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(226, 232, 240, 0) 0%,
          rgba(226, 232, 240, 1) 20%,
          rgba(226, 232, 240, 1) 80%,
          rgba(226, 232, 240, 0) 100%
        );
        margin: 16px 0 14px;
      }

      .brand-area {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
      }

      .brand-mark {
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: linear-gradient(135deg, #2563eb 0%, #0f4fd6 100%);
        position: relative;
        box-shadow: 0 12px 28px rgba(37, 99, 235, 0.28);
        flex-shrink: 0;
      }

      .brand-mark-core {
        position: absolute;
        inset: 12px;
        border-radius: 12px;
        background:
          radial-gradient(circle at top left, rgba(255, 255, 255, 0.9), transparent 50%),
          rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.28);
      }

      .brand-text h1 {
        margin: 0 0 2px;
        font-size: 30px;
        line-height: 1.05;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.03em;
      }

      .brand-text p {
        margin: 0;
        color: #64748b;
        font-size: 14px;
        line-height: 1.45;
      }

      .nav-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }

      .nav-menu {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .nav-menu a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 10px 15px;
        border-radius: 12px;
        color: #475569;
        font-weight: 700;
        font-size: 14px;
        transition:
          background-color 0.2s ease,
          color 0.2s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
        white-space: nowrap;
      }

      .nav-menu a:hover {
        background: #eff6ff;
        color: #1d4ed8;
        transform: translateY(-1px);
      }

      .active-link {
        background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
        color: #1d4ed8 !important;
        box-shadow: inset 0 0 0 1px #bfdbfe;
      }

      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .desktop-user-area {
        flex-shrink: 0;
      }

      .mobile-user-area {
        display: none;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        min-width: 0;
        line-height: 1.2;
      }

      .user-label {
        margin-bottom: 4px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #94a3b8;
      }

      .user-info strong {
        color: #0f172a;
        font-size: 15px;
        max-width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-info span {
        color: #64748b;
        font-size: 13px;
        text-transform: capitalize;
      }

      .logout-btn {
        min-width: 76px;
        height: 44px;
        padding: 0 18px;
        border-radius: 12px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: #ffffff;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(220, 38, 38, 0.18);
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          filter 0.18s ease;
      }

      .logout-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 26px rgba(220, 38, 38, 0.24);
        filter: saturate(1.02);
      }

      .mobile-menu-btn {
        display: none;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
      }

      .mobile-menu-btn span {
        width: 18px;
        height: 2px;
        border-radius: 999px;
        background: #0f172a;
        display: block;
      }

      .content-area {
        flex: 1;
        width: 100%;
        padding: 24px 20px 30px;
      }

      .content-shell {
        max-width: 1480px;
        margin: 0 auto;
      }

      .footer {
        padding: 0 20px 20px;
      }

      .footer-inner {
        max-width: 1480px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 22px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
      }

      .footer-inner p {
        margin: 0;
        color: #64748b;
        font-size: 14px;
      }

      .footer-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
      }

      @media (max-width: 1100px) {
        .topbar-inner,
        .footer-inner {
          border-radius: 22px;
        }

        .brand-text h1 {
          font-size: 28px;
        }
      }

      @media (max-width: 900px) {
        .topbar {
          padding: 14px 14px 0;
        }

        .topbar-inner {
          padding: 16px 16px 14px;
        }

        .desktop-user-area {
          display: none;
        }

        .mobile-menu-btn {
          display: inline-flex;
        }

        .topbar-main {
          align-items: center;
        }

        .nav-wrapper {
          display: none;
          flex-direction: column;
          align-items: stretch;
          gap: 14px;
        }

        .nav-wrapper.mobile-open {
          display: flex;
        }

        .nav-menu {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .nav-menu a {
          width: 100%;
          white-space: normal;
          text-align: center;
          padding: 11px 12px;
        }

        .mobile-user-area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 6px;
          border-top: 1px solid #e2e8f0;
        }

        .mobile-user-area .user-info {
          align-items: flex-start;
        }

        .content-area {
          padding: 18px 14px 24px;
        }

        .footer {
          padding: 0 14px 14px;
        }

        .footer-inner {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      @media (max-width: 640px) {
        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
        }

        .brand-mark-core {
          inset: 10px;
          border-radius: 10px;
        }

        .brand-text h1 {
          font-size: 24px;
        }

        .brand-text p {
          font-size: 13px;
        }

        .nav-menu {
          grid-template-columns: 1fr 1fr;
        }

        .footer-badge {
          white-space: normal;
          text-align: center;
          min-height: auto;
          padding: 8px 12px;
        }
      }

      @media (max-width: 420px) {
        .nav-menu {
          grid-template-columns: 1fr;
        }

        .mobile-user-area {
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }

        .mobile-user-area .logout-btn {
          width: 100%;
        }

        .footer-inner p {
          font-size: 13px;
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
    if (window.innerWidth > 900 && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
