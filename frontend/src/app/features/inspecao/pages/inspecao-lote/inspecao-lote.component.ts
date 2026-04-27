import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoteService } from '../../../lotes/services/lote.service';
import { Lote } from '../../../lotes/models/lote.model';
import { InspecaoService } from '../../services/inspecao.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-inspecao-lote',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  template: `
    <section class="inspecao-page">
      <div class="page-header">
        <div>
          <span class="eyebrow">INSPEÇÃO</span>
          <h2>Inspeção de lote</h2>
          <p>Selecione um lote e registre o resultado da inspeção de qualidade.</p>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <h3>Registrar inspeção</h3>

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
                  <h4>Inspeção já registrada</h4>

                  @if (isGestor) {
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
            } @else {
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

                <button type="submit" [disabled]="saving">
                  {{ saving ? 'Salvando...' : 'Registrar inspeção' }}
                </button>
              </form>
            }
          } @else {
            <app-empty-state
              title="Nenhum lote selecionado"
              description="Selecione um lote para registrar ou consultar a inspeção."
            />
          }
        </section>

        <section class="list-card">
          <div class="list-header">
            <h3>Resumo do lote</h3>
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
    </section>
  `,
  styles: [
    `
      .inspecao-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .eyebrow {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #2563eb;
      }

      .page-header h2 {
        font-size: 32px;
        margin-bottom: 8px;
        color: #0f172a;
      }

      .page-header p {
        color: #64748b;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 420px 1fr;
        gap: 24px;
      }

      .form-card,
      .list-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
      }

      .form-card h3,
      .list-card h3 {
        margin-bottom: 18px;
        color: #0f172a;
      }

      .form-group {
        margin-bottom: 14px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #334155;
      }

      input,
      select,
      textarea {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
      }

      input:focus,
      select:focus,
      textarea:focus {
        border-color: #2563eb;
      }

      .selected-lote-box,
      .already-inspected-box {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
        margin-bottom: 18px;
      }

      .selected-lote-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .inspection-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .already-inspected-box h4 {
        margin: 0;
        color: #0f172a;
      }

      .already-inspected-box p {
        margin-bottom: 8px;
        color: #334155;
      }

      .alert {
        border-radius: 10px;
        padding: 12px;
        margin-bottom: 14px;
        font-size: 14px;
      }

      .alert.error {
        background: #fef2f2;
        color: #b91c1c;
      }

      .alert.success {
        background: #ecfdf5;
        color: #166534;
      }

      button {
        height: 44px;
        padding: 0 16px;
        border: none;
        border-radius: 10px;
        background: #2563eb;
        color: white;
        font-weight: 700;
        cursor: pointer;
      }

      .secondary-btn {
        background: #e2e8f0;
        color: #0f172a;
      }

      .delete-btn {
        background: #dc2626;
        color: #ffffff;
        height: 40px;
      }

      .delete-btn:hover {
        background: #b91c1c;
      }

      .list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .summary-card {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
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
      }

      @media (max-width: 1100px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .summary-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .page-header h2 {
          font-size: 26px;
        }

        .form-card,
        .list-card {
          padding: 18px;
        }

        .selected-lote-top,
        .list-header,
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

  lotes: Lote[] = [];
  selectedLoteId = '';
  selectedLote: Lote | null = null;

  saving = false;
  deleting = false;
  errorMessage = '';
  successMessage = '';

  inspecaoForm = this.fb.group({
    resultado: ['', [Validators.required]],
    quantidade_repr: [0, [Validators.required, Validators.min(0)]],
    descricao_desvio: [''],
  });

  get isGestor(): boolean {
    return this.authService.getUser()?.perfil === 'gestor';
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
        const lote =
          response.data.find((item) => item.id === this.selectedLoteId) ?? null;
        this.selectedLote = lote;
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

  formatResultado(resultado: string): string {
    const labels: Record<string, string> = {
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
          this.errorMessage =
            'Seu perfil não tem permissão para registrar inspeção.';
          return;
        }

        if (error.status === 409) {
          this.errorMessage = 'Este lote já possui inspeção registrada.';
          return;
        }

        if (error.status === 400) {
          this.errorMessage =
            'Dados inválidos para registrar a inspeção. Verifique os campos preenchidos.';
          return;
        }

        this.errorMessage = 'Erro ao registrar inspeção do lote.';
      },
    });
  }

  onDeleteInspecao(): void {
    if (!this.selectedLoteId || !this.isGestor) return;

    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir esta inspeção?'
    );

    if (!confirmDelete) return;

    this.deleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.inspecaoService.deleteInspecao(this.selectedLoteId).subscribe({
      next: (response) => {
        this.deleting = false;
        this.successMessage = response.message;
        this.selectedLote = response.lote;
      },
      error: (error) => {
        this.deleting = false;

        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para excluir inspeção.';
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
