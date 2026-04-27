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
      <div class="page-header">
        <div>
          <span class="eyebrow">INSUMOS</span>
          <h2>Insumos por lote</h2>
          <p>Selecione um lote e vincule os insumos utilizados na produção.</p>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <h3>Adicionar insumo</h3>

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

              <button type="submit" [disabled]="saving">
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
          <div class="list-header">
            <h3>Insumos do lote</h3>
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
            <div class="table-wrapper">
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

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #334155;
      }

      input,
      select {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
      }

      input:focus,
      select:focus {
        border-color: #2563eb;
      }

      .selected-lote-box {
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

      .remove-btn {
        background: #fee2e2;
        color: #b91c1c;
        height: 36px;
        padding: 0 12px;
        font-size: 13px;
      }

      .list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        text-align: left;
        padding: 14px 12px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: middle;
      }

      th {
        font-size: 13px;
        color: #64748b;
      }

      .strong {
        font-weight: 800;
      }

      @media (max-width: 1100px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .page-header h2 {
          font-size: 26px;
        }

        .form-card,
        .list-card {
          padding: 18px;
        }

        .selected-lote-top,
        .list-header {
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
      error: (error) => {
        this.saving = false;

        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para adicionar insumos.';
          return;
        }

        this.errorMessage = 'Erro ao adicionar insumo ao lote.';
      },
    });
  }

  removeInsumo(insumoId: string): void {
    if (!this.selectedLoteId) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.insumoLoteService
      .removeInsumoFromLote(this.selectedLoteId, insumoId)
      .subscribe({
        next: () => {
          this.successMessage = 'Insumo removido com sucesso.';
          this.refreshSelectedLote();
        },
        error: (error) => {
          if (error.status === 403) {
            this.errorMessage =
              'Seu perfil não tem permissão para remover insumos.';
            return;
          }

          this.errorMessage = 'Erro ao remover insumo do lote.';
        },
      });
  }
}
