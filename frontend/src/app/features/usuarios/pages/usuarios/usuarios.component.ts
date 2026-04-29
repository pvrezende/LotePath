import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { Usuario, UsuarioPerfil } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmptyStateComponent],
  template: `
    <section class="usuarios-page">
      <div class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow">GESTÃO DE ACESSOS</span>
          <h2>Usuários do sistema</h2>
          <p>
            Crie usuários e defina o perfil de acesso. Apenas gestores podem
            acessar esta área e cadastrar novos funcionários no sistema.
          </p>
        </div>

        <div class="hero-badge">
          <span class="hero-label">Usuários cadastrados</span>
          <strong>{{ usuarios.length }}</strong>
          <small>contas disponíveis</small>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <div class="card-header">
            <div>
              <h3>Novo usuário</h3>
              <p>Informe os dados e selecione o tipo de usuário.</p>
            </div>

            <span class="card-chip">Gestor</span>
          </div>

          <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="nome">Nome</label>
              <input id="nome" type="text" formControlName="nome" />
            </div>

            <div class="form-group">
              <label for="email">E-mail</label>
              <input id="email" type="email" formControlName="email" />
            </div>

            <div class="form-group">
              <label for="senha">Senha</label>
              <input id="senha" type="password" formControlName="senha" />
            </div>

            <div class="form-group">
              <label for="perfil">Perfil</label>
              <select id="perfil" formControlName="perfil">
                <option value="">Selecione o perfil</option>
                <option value="operador">Operador</option>
                <option value="inspetor">Inspetor</option>
                <option value="gestor">Gestor</option>
              </select>
            </div>

            @if (errorMessage) {
              <div class="alert error">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="alert success">{{ successMessage }}</div>
            }

            <button type="submit" class="primary-btn" [disabled]="saving">
              {{ saving ? 'Salvando...' : 'Criar usuário' }}
            </button>
          </form>
        </section>

        <section class="list-card">
          <div class="card-header">
            <div>
              <h3>Usuários cadastrados</h3>
              <p>Consulte os acessos existentes no sistema.</p>
            </div>

            <button type="button" class="secondary-btn" (click)="loadUsuarios()">
              Atualizar
            </button>
          </div>

          @if (loading) {
            <div class="feedback-box">
              <div class="loading-line"></div>
              <p>Carregando usuários...</p>
            </div>
          } @else if (usuarios.length > 0) {
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Perfil</th>
                    <th>Criado em</th>
                  </tr>
                </thead>

                <tbody>
                  @for (usuario of usuarios; track usuario.id) {
                    <tr>
                      <td class="strong">{{ usuario.nome }}</td>
                      <td>{{ usuario.email }}</td>
                      <td>
                        <span class="perfil-chip" [class]="usuario.perfil">
                          {{ formatPerfil(usuario.perfil) }}
                        </span>
                      </td>
                      <td>{{ formatDateTime(usuario.criado_em) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <app-empty-state
              title="Nenhum usuário cadastrado"
              description="Crie o primeiro usuário para iniciar a gestão de acessos."
            />
          }
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .usuarios-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .hero-card,
      .form-card,
      .list-card,
      .feedback-box {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
      }

      .hero-card {
        border-radius: 24px;
        padding: 28px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        background:
          radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 32%),
          rgba(255, 255, 255, 0.92);
      }

      .eyebrow {
        display: inline-flex;
        margin-bottom: 10px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #2563eb;
      }

      .hero-copy h2 {
        margin: 0 0 10px;
        font-size: 38px;
        line-height: 1.05;
        color: #0f172a;
        letter-spacing: -0.03em;
      }

      .hero-copy p {
        margin: 0;
        max-width: 760px;
        color: #64748b;
        line-height: 1.7;
      }

      .hero-badge {
        min-width: 220px;
        padding: 18px 20px;
        border-radius: 20px;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 1px solid #bfdbfe;
      }

      .hero-label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #2563eb;
      }

      .hero-badge strong {
        display: block;
        font-size: 28px;
        line-height: 1;
        margin-bottom: 6px;
        color: #0f172a;
      }

      .hero-badge small {
        color: #475569;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 380px 1fr;
        gap: 24px;
      }

      .form-card,
      .list-card,
      .feedback-box {
        border-radius: 24px;
        padding: 24px;
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
      }

      .card-header h3 {
        margin: 0 0 4px;
        font-size: 24px;
        color: #0f172a;
      }

      .card-header p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
      }

      .card-chip,
      .perfil-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
      }

      .card-chip {
        min-height: 34px;
        padding: 0 12px;
        background: #eff6ff;
        color: #1d4ed8;
      }

      .perfil-chip {
        min-height: 32px;
        padding: 0 12px;
        text-transform: capitalize;
      }

      .perfil-chip.operador {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .perfil-chip.inspetor {
        background: #dcfce7;
        color: #15803d;
      }

      .perfil-chip.gestor {
        background: #fef3c7;
        color: #b45309;
      }

      .form-group {
        margin-bottom: 14px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 700;
        color: #334155;
      }

      input,
      select {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
      }

      input:focus,
      select:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .primary-btn,
      .secondary-btn {
        height: 44px;
        padding: 0 16px;
        border-radius: 12px;
        border: none;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .primary-btn {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
      }

      .secondary-btn {
        background: #f1f5f9;
        color: #0f172a;
        border: 1px solid #e2e8f0;
      }

      .primary-btn:hover,
      .secondary-btn:hover {
        transform: translateY(-1px);
      }

      .alert {
        border-radius: 12px;
        padding: 12px 14px;
        margin-bottom: 14px;
        font-size: 14px;
      }

      .alert.error {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }

      .alert.success {
        background: #ecfdf5;
        color: #166534;
        border: 1px solid #bbf7d0;
      }

      .table-wrapper {
        overflow-x: auto;
        border-radius: 18px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        text-align: left;
        padding: 15px 12px;
        border-bottom: 1px solid #e5e7eb;
      }

      th {
        font-size: 12px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      td {
        color: #0f172a;
      }

      .strong {
        font-weight: 800;
      }

      .loading-line {
        width: 160px;
        height: 10px;
        border-radius: 999px;
        margin-bottom: 14px;
        background: linear-gradient(90deg, #dbeafe 0%, #93c5fd 50%, #dbeafe 100%);
        animation: pulse 1.4s infinite ease-in-out;
      }

      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }

      @media (max-width: 1180px) {
        .hero-card {
          flex-direction: column;
          align-items: flex-start;
        }

        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .hero-card,
        .form-card,
        .list-card,
        .feedback-box {
          padding: 18px;
          border-radius: 20px;
        }

        .hero-copy h2 {
          font-size: 30px;
        }

        .card-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class UsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  usuarioForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    perfil: ['' as UsuarioPerfil | '', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.errorMessage = '';

    this.usuarioService.getUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 403) {
          this.errorMessage = 'Seu perfil não tem permissão para listar usuários.';
          return;
        }

        this.errorMessage = 'Não foi possível carregar os usuários.';
      },
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      nome: this.usuarioForm.value.nome ?? '',
      email: this.usuarioForm.value.email ?? '',
      senha: this.usuarioForm.value.senha ?? '',
      perfil: this.usuarioForm.value.perfil as UsuarioPerfil,
    };

    this.usuarioService.createUsuario(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Usuário criado com sucesso.';
        this.usuarioForm.reset({
          nome: '',
          email: '',
          senha: '',
          perfil: '',
        });
        this.loadUsuarios();
      },
      error: (error) => {
        this.saving = false;

        if (error.status === 409) {
          this.errorMessage = 'Já existe um usuário com esse e-mail.';
          return;
        }

        if (error.status === 403) {
          this.errorMessage = 'Seu perfil não tem permissão para criar usuários.';
          return;
        }

        if (error.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
          return;
        }

        this.errorMessage = 'Erro ao criar usuário.';
      },
    });
  }

  formatPerfil(perfil: string): string {
    const labels: Record<string, string> = {
      operador: 'Operador',
      inspetor: 'Inspetor',
      gestor: 'Gestor',
    };

    return labels[perfil] ?? perfil;
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}
