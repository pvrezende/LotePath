import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div style="min-height: 100vh; display: grid; place-items: center; padding: 24px;">
      <div
        style="
          width: 100%;
          max-width: 420px;
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        "
      >
        <h1 style="margin-bottom: 8px;">LotePath</h1>
        <p style="margin-bottom: 24px; color: #6b7280;">
          Tela de login em construção.
        </p>

        <p style="font-size: 14px; color: #2563eb;">
          Próximo passo: conectar autenticação com o backend.
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {}
