import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoteService } from '../../../lotes/services/lote.service';
import { Lote } from '../../../lotes/models/lote.model';
import { InsumoLoteService } from '../../services/insumo-lote.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-insumos-lote',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  template: `
    <section class="insumos-page">
      <div class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow">INSUMOS</span>
          <h2>Vinculação de insumos</h2>
          <p>
            Selecione um lote, registre os materiais utilizados e mantenha a
            rastreabilidade do processo produtivo com mais clareza visual.
          </p>
        </div>

        <div class="hero-badge">
          <span class="hero-label">Lotes carregados</span>
          <strong>{{ lotes.length }}</strong>
          <small>disponíveis para vínculo</small>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <div class="card-header">
            <div>
              <h3>Adicionar insumo</h3>
              <p>Escolha o lote e informe os dados do insumo utilizado.</p>
            </div>

            <span class="card-chip">Rastreabilidade</span>
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
            </div>

            <form [formGroup]="insumoForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="nome_insumo">Nome do insumo</label>
                <input
                  id="nome_insumo"
                  type="text"
                  formControlName="nome_insumo"
                />
              </div>

              <div class="form-group">
                <label for="codigo_insumo">Código do insumo</label>
                <input
                  id="codigo_insumo"
                  type="text"
                  formControlName="codigo_insumo"
                />
              </div>

              <div class="form-group">
                <label for="lote_insumo">Lote do insumo</label>
                <input
                  id="lote_insumo"
                  type="text"
                  formControlName="lote_insumo"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="quantidade">Quantidade</label>
                  <input
                    id="quantidade"
                    type="number"
                    formControlName="quantidade"
                  />
                </div>

                <div class="form-group">
                  <label for="unidade">Unidade</label>
                  <input
                    id="unidade"
                    type="text"
                    formControlName="unidade"
                    placeholder="kg, un, mL..."
                  />
                </div>
              </div>

              @if (errorMessage) {
                <div class="alert error">{{ errorMessage }}</div>
              }

              @if (successMessage) {
                <div class="alert success">{{ successMessage }}</div>
              }

              <button type="submit" class="primary-btn" [disabled]="saving">
                {{ saving ? 'Salvando...' : 'Adicionar insumo' }}
              </button>
            </form>
          } @else {
            <app-empty-state
              title="Nenhum lote selecionado"
              description="Selecione um lote para visualizar e vincular os insumos utilizados."
            />
          }
        </section>

        <section class="list-card">
          <div class="card-header">
            <div>
              <h3>Insumos do lote</h3>
              <p>Consulte os materiais já vinculados ao lote selecionado.</p>
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
              description="Escolha um lote na lateral para visualizar os insumos vinculados."
            />
          } @else if (selectedLote.insumos && selectedLote.insumos.length > 0) {
            <div class="mobile-insumo-list">
              @for (insumo of selectedLote.insumos; track insumo.id) {
                <article class="mobile-insumo-card">
                  <div class="mobile-insumo-head">
                    <strong>{{ insumo.nome_insumo }}</strong>
                    <button
                      type="button"
                      class="remove-btn"
                      (click)="removeInsumo(insumo.id)"
                    >
                      Remover
                    </button>
                  </div>

                  <div class="mobile-insumo-body">
                    <span><b>Código:</b> {{ insumo.codigo_insumo }}</span>
                    <span><b>Lote:</b> {{ insumo.lote_insumo }}</span>
                    <span><b>Quantidade:</b> {{ insumo.quantidade }}</span>
                    <span><b>Unidade:</b> {{ insumo.unidade }}</span>
                  </div>
                </article>
              }
            </div>

            <div class="table-wrapper desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Código</th>
                    <th>Lote do insumo</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  @for (insumo of selectedLote.insumos; track insumo.id) {
                    <tr>
                      <td class="strong">{{ insumo.nome_insumo }}</td>
                      <td>{{ insumo.codigo_insumo }}</td>
                      <td>{{ insumo.lote_insumo }}</td>
                      <td>{{ insumo.quantidade }}</td>
                      <td>{{ insumo.unidade }}</td>
                      <td>
                        <button
                          type="button"
                          class="remove-btn"
                          (click)="removeInsumo(insumo.id)"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <app-empty-state
              title="Nenhum insumo vinculado"
              description="Este lote ainda não possui insumos cadastrados."
            />
          }
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .insumos-page {
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

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
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
        transition: border-color 0.18s ease, box-shadow 0.18s ease;
      }

      input:focus,
      select:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .selected-lote-box {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
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

      .primary-btn,
      .secondary-btn,
      .remove-btn {
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

      .remove-btn {
        height: 38px;
        padding: 0 12px;
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #fecaca;
        font-size: 13px;
      }

      .primary-btn:hover,
      .secondary-btn:hover,
      .remove-btn:hover {
        transform: translateY(-1px);
      }

      .table-wrapper {
        overflow-x: auto;
        border-radius: 18px;
      }

      .desktop-table {
        display: block;
      }

      .mobile-insumo-list {
        display: none;
        flex-direction: column;
        gap: 12px;
      }

      .mobile-insumo-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mobile-insumo-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .mobile-insumo-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: #334155;
        font-size: 14px;
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
        vertical-align: middle;
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

      tbody tr:hover {
        background: #f8fafc;
      }

      .strong {
        font-weight: 800;
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

        .card-header,
        .selected-lote-top {
          flex-direction: column;
          align-items: flex-start;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .desktop-table {
          display: none;
        }

        .mobile-insumo-list {
          display: flex;
        }
      }

      @media (max-width: 480px) {
        .hero-copy h2 {
          font-size: 26px;
        }

        .mobile-insumo-head {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class InsumosLoteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loteService = inject(LoteService);
  private insumoLoteService = inject(InsumoLoteService);

  lotes: Lote[] = [];
  selectedLoteId = '';
  selectedLote: Lote | null = null;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  insumoForm = this.fb.group({
    nome_insumo: ['', [Validators.required]],
    codigo_insumo: ['', [Validators.required]],
    lote_insumo: ['', [Validators.required]],
    quantidade: [null as number | null, [Validators.required, Validators.min(1)]],
    unidade: ['', [Validators.required]],
  });

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
        const lote = response.data.find((item) => item.id === this.selectedLoteId) ?? null;
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

  onSubmit(): void {
    if (this.insumoForm.invalid || !this.selectedLoteId) {
      this.insumoForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      nome_insumo: this.insumoForm.value.nome_insumo ?? '',
      codigo_insumo: this.insumoForm.value.codigo_insumo ?? '',
      lote_insumo: this.insumoForm.value.lote_insumo ?? '',
      quantidade: this.insumoForm.value.quantidade ?? 0,
      unidade: this.insumoForm.value.unidade ?? '',
    };

    this.insumoLoteService.addInsumoToLote(this.selectedLoteId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Insumo adicionado com sucesso.';
        this.insumoForm.reset({
          nome_insumo: '',
          codigo_insumo: '',
          lote_insumo: '',
          quantidade: null,
          unidade: '',
        });
        this.refreshSelectedLote();
      },
      error: (error: any) => {
        this.saving = false;

        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para adicionar insumos.';
          return;
        }

        if (error.status === 400) {
          this.errorMessage =
            'Dados inválidos para cadastrar o insumo. Verifique os campos.';
          return;
        }

        this.errorMessage = 'Erro ao adicionar insumo ao lote.';
      },
    });
  }

  removeInsumo(insumoId: string): void {
    if (!this.selectedLoteId) return;

    const confirmed = window.confirm(
      'Tem certeza que deseja remover este insumo do lote?'
    );

    if (!confirmed) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.insumoLoteService
  .removeInsumoFromLote(this.selectedLoteId, insumoId)
  .subscribe({
      next: () => {
        this.successMessage = 'Insumo removido com sucesso.';
        this.refreshSelectedLote();
      },
      error: () => {
        this.errorMessage = 'Erro ao remover o insumo do lote.';
      },
    });
  }
}
