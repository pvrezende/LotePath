import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-shell">
        <section class="login-brand">

          <div class="login-logo-area">
            <img
              src="/assets/imagens/Lotepath.png"
              alt="Logo LotePath"
              class="login-logo"
            />
          </div>

          <span class="brand-chip">LotePath</span>

          <h1>Controle produtivo com apresentação profissional</h1>
          <p>
            Acesse o sistema para gerenciar lotes, inspeções, insumos e
            rastreabilidade com uma experiência mais moderna e corporativa.
          </p>

          <div class="brand-card">
            <h3>O que você encontra aqui</h3>
            <ul>
              <li>Abertura e gestão de lotes</li>
              <li>Inspeção de qualidade</li>
              <li>Vínculo de insumos por lote</li>
              <li>Consulta de rastreabilidade</li>
            </ul>
          </div>
        </section>

        <section class="login-card">
          <div class="login-header">
            <h2>Entrar no sistema</h2>
            <p>Faça login para acessar o ambiente de rastreamento por lotes.</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="Digite seu e-mail"
              />
              @if (isFieldInvalid('email')) {
                <small class="error">Informe um e-mail válido.</small>
              }
            </div>

            <div class="form-group">
              <label for="senha">Senha</label>
              <input
                id="senha"
                type="password"
                formControlName="senha"
                placeholder="Digite sua senha"
              />
              @if (isFieldInvalid('senha')) {
                <small class="error">A senha deve ter no mínimo 6 caracteres.</small>
              }
            </div>

            @if (errorMessage) {
              <div class="alert-error">
                {{ errorMessage }}
              </div>
            }

            <button type="submit" class="login-btn" [disabled]="loading">
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <div class="login-hint">
            <strong>Usuários de teste</strong>
            <span>operador@lotepath.com / 123456</span>
            <span>inspetor@lotepath.com / 123456</span>
            <span>gestor@lotepath.com / 123456</span>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 26%),
          radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.12), transparent 24%),
          linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
      }

      .login-shell {
        width: 100%;
        max-width: 1180px;
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 24px;
        align-items: stretch;
      }

      .login-brand,
      .login-card {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 28px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }

      .login-brand {
        padding: 36px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
        background:
          radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 30%),
          rgba(255, 255, 255, 0.92);
      }

      .login-logo-area {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 8px;
      }

      .login-logo {
        width: 400px;
        max-width: 100%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(0 18px 28px rgba(15, 23, 42, 0.14));
      }

      .brand-chip {
        display: inline-flex;
        width: fit-content;
        min-height: 34px;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .login-brand h1 {
        margin: 0;
        font-size: 46px;
        line-height: 1.04;
        letter-spacing: -0.04em;
        color: #0f172a;
      }

      .login-brand p {
        margin: 0;
        color: #64748b;
        line-height: 1.8;
        font-size: 16px;
      }

      .brand-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 22px;
        padding: 22px;
      }

      .brand-card h3 {
        margin: 0 0 14px;
        color: #0f172a;
        font-size: 20px;
      }

      .brand-card ul {
        margin: 0;
        padding-left: 18px;
        color: #334155;
        line-height: 1.9;
      }

      .login-card {
        padding: 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .login-header h2 {
        margin: 0 0 8px;
        font-size: 32px;
        color: #0f172a;
        letter-spacing: -0.03em;
      }

      .login-header p {
        margin: 0 0 24px;
        color: #64748b;
        line-height: 1.6;
      }

      .form-group {
        margin-bottom: 16px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 700;
        color: #334155;
      }

      input {
        width: 100%;
        height: 48px;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 0 14px;
        outline: none;
        background: #fff;
        transition: border-color 0.18s ease, box-shadow 0.18s ease;
      }

      input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .error {
        display: block;
        margin-top: 6px;
        color: #dc2626;
        font-size: 12px;
      }

      .alert-error {
        margin-bottom: 16px;
        padding: 12px 14px;
        border-radius: 12px;
        background: #fef2f2;
        color: #b91c1c;
        font-size: 14px;
        border: 1px solid #fecaca;
      }

      .login-btn {
        width: 100%;
        height: 48px;
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
        transition: 0.2s ease;
      }

      .login-btn:hover {
        transform: translateY(-1px);
      }

      .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }

      .login-hint {
        margin-top: 22px;
        padding-top: 18px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 14px;
        color: #475569;
        line-height: 1.6;
      }

      .login-hint strong {
        color: #0f172a;
      }

      @media (max-width: 980px) {
        .login-shell {
          grid-template-columns: 1fr;
        }

        .login-brand h1 {
          font-size: 38px;
        }
      }

      @media (max-width: 640px) {
        .login-page {
          padding: 16px;
        }

        .login-brand,
        .login-card {
          padding: 22px;
          border-radius: 22px;
        }

        .login-brand h1 {
          font-size: 30px;
        }

        .login-header h2 {
          font-size: 28px;
        }
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  isFieldInvalid(fieldName: 'email' | 'senha'): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      email: this.loginForm.value.email ?? '',
      senha: this.loginForm.value.senha ?? '',
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'E-mail ou senha inválidos.';
          return;
        }

        if (error.status === 0) {
          this.errorMessage =
            'Não foi possível conectar ao backend. Verifique se a API está rodando.';
          return;
        }

        this.errorMessage = 'Ocorreu um erro ao tentar fazer login.';
      },
    });
  }
}
