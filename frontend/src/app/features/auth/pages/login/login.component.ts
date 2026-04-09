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
      <div class="login-card">
        <h1>LotePath</h1>
        <p class="subtitle">
          Faça login para acessar o sistema de rastreamento por lotes.
        </p>

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

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="login-hint">
          <strong>Usuários seed:</strong><br />
          operador@lotepath.com / 123456<br />
          inspetor@lotepath.com / 123456
        </div>
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
        background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
      }

      .login-card {
        width: 100%;
        max-width: 420px;
        background: #ffffff;
        padding: 32px;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      }

      h1 {
        margin-bottom: 8px;
        font-size: 28px;
      }

      .subtitle {
        margin-bottom: 24px;
        color: #6b7280;
        line-height: 1.5;
      }

      .form-group {
        margin-bottom: 16px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
      }

      input {
        width: 100%;
        height: 44px;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 0 14px;
        outline: none;
      }

      input:focus {
        border-color: #2563eb;
      }

      .error {
        display: block;
        margin-top: 6px;
        color: #dc2626;
        font-size: 12px;
      }

      .alert-error {
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 10px;
        background: #fef2f2;
        color: #b91c1c;
        font-size: 14px;
      }

      button {
        width: 100%;
        height: 46px;
        border: none;
        border-radius: 10px;
        background: #2563eb;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .login-hint {
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
        font-size: 14px;
        color: #4b5563;
        line-height: 1.6;
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
