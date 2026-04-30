import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoteService } from '../../../lotes/services/lote.service';
import { Lote } from '../../../lotes/models/lote.model';
import { InspecaoService } from '../../services/inspecao.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { AuthService } from '../../../../core/services/auth.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-inspecao-lote',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    StatusBadgeComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <section class="inspecao-page">
      <div class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow">INSPEÇÃO</span>
          <h2>Inspeção de qualidade</h2>
          <p>
            Selecione um lote, registre o resultado da inspeção e acompanhe o
            resumo operacional com uma visualização mais clara e profissional.
          </p>
        </div>

        <div class="hero-badge">
          <span class="hero-label">Lotes disponíveis</span>
          <strong>{{ lotes.length }}</strong>
          <small>para consulta e inspeção</small>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <div class="card-header">
            <div>
              <h3>Registrar inspeção</h3>
              <p>Escolha um lote e informe o resultado da análise de qualidade.</p>
            </div>

            <span class="card-chip">Qualidade</span>
          </div>

          <div class="form-group">
            <label for="loteSelect">Lote</label>
            <select
              id="loteSelect"
              [value]="selectedLoteId"
              (change)="onSelectLote($event)"
            >
              <option value="">Selecione um lote</option>
              @for (lote of lotes; track lote.id) {
                <option [value]="lote.id">
                  {{ lote.numero_lote }} - {{ lote.produto.nome }}
                </option>
              }
            </select>
          </div>

          @if (selectedLote) {
            <div class="selected-lote-box">
              <div class="selected-lote-top">
                <strong>{{ selectedLote.numero_lote }}</strong>
                <app-status-badge [status]="selectedLote.status" />
              </div>
              <p><b>Produto:</b> {{ selectedLote.produto.nome }}</p>
              <p><b>Turno:</b> {{ formatTurno(selectedLote.turno) }}</p>
              <p><b>Quantidade produzida:</b> {{ selectedLote.quantidade_prod }}</p>
            </div>

            @if (selectedLote.inspecao) {
              <div class="already-inspected-box">
                <div class="inspection-header">
                  <div>
                    <h4>Inspeção já registrada</h4>
                    <small>O lote já possui resultado salvo no sistema.</small>
                  </div>

                  @if (canDeleteInspecao) {
                    <button
                      type="button"
                      class="delete-btn"
                      (click)="onDeleteInspecao()"
                      [disabled]="deleting"
                    >
                      {{ deleting ? 'Excluindo...' : 'Excluir inspeção' }}
                    </button>
                  }
                </div>

                <p><b>Resultado:</b> {{ formatResultado(selectedLote.inspecao.resultado) }}</p>
                <p><b>Quantidade reprovada:</b> {{ selectedLote.inspecao.quantidade_repr }}</p>
                <p>
                  <b>Descrição do desvio:</b>
                  {{ selectedLote.inspecao.descricao_desvio || 'Nenhum desvio informado.' }}
                </p>
                <p><b>Inspecionado em:</b> {{ formatDateTime(selectedLote.inspecao.inspecionado_em) }}</p>
              </div>
            } @else if (canInspectLotes) {
              <form [formGroup]="inspecaoForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                  <label for="resultado">Resultado</label>
                  <select id="resultado" formControlName="resultado">
                    <option value="">Selecione o resultado</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="aprovado_restricao">Aprovado com restrição</option>
                    <option value="reprovado">Reprovado</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="quantidade_repr">Quantidade reprovada</label>
                  <input
                    id="quantidade_repr"
                    type="number"
                    formControlName="quantidade_repr"
                  />
                </div>

                <div class="form-group">
                  <label for="descricao_desvio">Descrição do desvio</label>
                  <textarea
                    id="descricao_desvio"
                    rows="4"
                    formControlName="descricao_desvio"
                    placeholder="Descreva o desvio encontrado, se houver."
                  ></textarea>
                </div>

                @if (errorMessage) {
                  <div class="alert error">{{ errorMessage }}</div>
                }

                @if (successMessage) {
                  <div class="alert success">{{ successMessage }}</div>
                }

                <button type="submit" class="primary-btn" [disabled]="saving">
                  {{ saving ? 'Salvando...' : 'Registrar inspeção' }}
                </button>
              </form>
            } @else {
              <div class="alert warning">
                Seu perfil não possui permissão para registrar inspeções.
              </div>
            }
          } @else {
            <app-empty-state
              title="Nenhum lote selecionado"
              description="Selecione um lote para registrar ou consultar a inspeção."
            />
          }
        </section>

        <section class="list-card">
          <div class="card-header">
            <div>
              <h3>Resumo do lote</h3>
              <p>Consulte rapidamente os dados operacionais do lote selecionado.</p>
            </div>

            @if (selectedLoteId) {
              <button type="button" class="secondary-btn" (click)="refreshSelectedLote()">
                Atualizar
              </button>
            }
          </div>

          @if (!selectedLote) {
            <app-empty-state
              title="Selecione um lote"
              description="Escolha um lote na lateral para visualizar o resumo e a inspeção."
            />
          } @else {
            <div class="summary-grid">
              <div class="summary-card">
                <span class="summary-label">Número do lote</span>
                <strong>{{ selectedLote.numero_lote }}</strong>
              </div>

              <div class="summary-card">
                <span class="summary-label">Produto</span>
                <strong>{{ selectedLote.produto.nome }}</strong>
              </div>

              <div class="summary-card">
                <span class="summary-label">Status atual</span>
                <app-status-badge [status]="selectedLote.status" />
              </div>

              <div class="summary-card">
                <span class="summary-label">Quantidade produzida</span>
                <strong>{{ selectedLote.quantidade_prod }}</strong>
              </div>

              <div class="summary-card">
                <span class="summary-label">Quantidade reprovada</span>
                <strong>{{ selectedLote.quantidade_repr }}</strong>
              </div>

              <div class="summary-card">
                <span class="summary-label">Observações</span>
                <p>{{ selectedLote.observacoes || 'Nenhuma observação informada.' }}</p>
              </div>
            </div>
          }
        </section>
      </div>

      <app-confirm-dialog
        [open]="confirmDialogOpen"
        title="Excluir inspeção"
        [message]="confirmDialogMessage"
        eyebrow="Ação restrita ao gestor"
        confirmText="Excluir inspeção"
        cancelText="Cancelar"
        variant="danger"
        (confirm)="confirmDeleteInspecao()"
        (cancel)="closeConfirmDialog()"
      />
    </section>
  `,
  styles: [
    `
      .inspecao-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .hero-card,
      .form-card,
      .list-card {
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
        grid-template-columns: 420px 1fr;
        gap: 24px;
      }

      .form-card,
      .list-card {
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

      .card-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
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
      select,
      textarea {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
      }

      input:focus,
      select:focus,
      textarea:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .selected-lote-box,
      .already-inspected-box,
      .summary-card {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 16px;
      }

      .selected-lote-box,
      .already-inspected-box {
        margin-bottom: 18px;
      }

      .selected-lote-top,
      .inspection-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .already-inspected-box h4 {
        margin: 0 0 4px;
        color: #0f172a;
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

      .alert.warning {
        background: #fffbeb;
        color: #b45309;
        border: 1px solid #fde68a;
      }

      .primary-btn,
      .secondary-btn,
      .delete-btn {
        border: none;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .primary-btn,
      .secondary-btn {
        height: 44px;
        padding: 0 16px;
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

      .delete-btn {
        height: 40px;
        padding: 0 14px;
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #fecaca;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .summary-label {
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #64748b;
        text-transform: uppercase;
      }

      .summary-card strong,
      .summary-card p {
        color: #0f172a;
        margin: 0;
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
        .list-card {
          padding: 18px;
          border-radius: 20px;
        }

        .hero-copy h2 {
          font-size: 30px;
        }

        .summary-grid {
          grid-template-columns: 1fr;
        }

        .card-header,
        .selected-lote-top,
        .inspection-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class InspecaoLoteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loteService = inject(LoteService);
  private inspecaoService = inject(InspecaoService);
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);

  lotes: Lote[] = [];
  selectedLoteId = '';
  selectedLote: Lote | null = null;
  confirmDialogOpen = false;
  confirmDialogMessage = '';

  saving = false;
  deleting = false;
  errorMessage = '';
  successMessage = '';

  inspecaoForm = this.fb.group({
    resultado: ['', [Validators.required]],
    quantidade_repr: [0, [Validators.required, Validators.min(0)]],
    descricao_desvio: [''],
  });

  get canInspectLotes(): boolean {
    return this.permissionService.hasPermission('canInspectLotes');
  }

  get canDeleteInspecao(): boolean {
    return this.permissionService.hasPermission('canDeleteInspecao');
  }

  ngOnInit(): void {
    this.loadLotes();
  }

  loadLotes(): void {
    this.loteService.getLotes().subscribe({
      next: (response) => {
        this.lotes = response.data;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os lotes.';
      },
    });
  }

  onSelectLote(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLoteId = value;
    this.errorMessage = '';
    this.successMessage = '';

    if (!value) {
      this.selectedLote = null;
      return;
    }

    this.refreshSelectedLote();
  }

  refreshSelectedLote(): void {
    if (!this.selectedLoteId) return;

    this.loteService.getLotes().subscribe({
      next: (response) => {
        this.selectedLote =
          response.data.find((item) => item.id === this.selectedLoteId) ?? null;
      },
      error: () => {
        this.errorMessage = 'Não foi possível atualizar o lote selecionado.';
      },
    });
  }

  formatTurno(turno: string): string {
    const labels: Record<string, string> = {
      manha: 'Manhã',
      tarde: 'Tarde',
      noite: 'Noite',
    };

    return labels[turno] ?? turno;
  }

  formatResultado(resultado: 'aprovado' | 'aprovado_restricao' | 'reprovado'): string {
    const labels = {
      aprovado: 'Aprovado',
      aprovado_restricao: 'Aprovado com restrição',
      reprovado: 'Reprovado',
    };

    return labels[resultado] ?? resultado;
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  onSubmit(): void {
    if (this.inspecaoForm.invalid || !this.selectedLoteId) {
      this.inspecaoForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getUser();

    if (!user) {
      this.errorMessage = 'Usuário não autenticado.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      inspetorId: user.id,
      resultado: this.inspecaoForm.value.resultado as
        | 'aprovado'
        | 'aprovado_restricao'
        | 'reprovado',
      quantidade_repr: this.inspecaoForm.value.quantidade_repr ?? 0,
      descricao_desvio: this.inspecaoForm.value.descricao_desvio?.trim() || null,
    };

    this.inspecaoService.createInspecao(this.selectedLoteId, payload).subscribe({
      next: (response) => {
        this.saving = false;
        this.successMessage = 'Inspeção registrada com sucesso.';
        this.selectedLote = response.lote;
      },
      error: (error) => {
        this.saving = false;

        if (error.status === 403) {
          this.errorMessage = 'Seu perfil não tem permissão para registrar inspeção.';
          return;
        }

        if (error.status === 409) {
          this.errorMessage = 'Este lote já possui inspeção registrada.';
          return;
        }

        if (error.status === 400) {
          this.errorMessage = 'Dados inválidos para registrar a inspeção.';
          return;
        }

        this.errorMessage = 'Erro ao registrar inspeção do lote.';
      },
    });
  }

  onDeleteInspecao(): void {
    if (!this.selectedLoteId || !this.canDeleteInspecao) return;

    this.confirmDialogMessage =
      'Tem certeza que deseja excluir esta inspeção? O lote voltará para aguardando inspeção e a ação será registrada na auditoria.';
    this.confirmDialogOpen = true;
  }

  closeConfirmDialog(): void {
    this.confirmDialogOpen = false;
    this.confirmDialogMessage = '';
  }

  confirmDeleteInspecao(): void {
    if (!this.selectedLoteId || !this.canDeleteInspecao) return;

    this.deleting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.closeConfirmDialog();

    this.inspecaoService.deleteInspecao(this.selectedLoteId).subscribe({
      next: (response) => {
        this.deleting = false;
        this.successMessage = response.message;
        this.selectedLote = response.lote;
      },
      error: (error) => {
        this.deleting = false;

        if (error.status === 403) {
          this.errorMessage = 'Seu perfil não tem permissão para excluir inspeção.';
          return;
        }

        if (error.status === 404) {
          this.errorMessage = 'Não foi encontrada inspeção para este lote.';
          return;
        }

        this.errorMessage = 'Erro ao excluir inspeção do lote.';
      },
    });
  }
}

