import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../../../produtos/services/produto.service';
import { Produto } from '../../../produtos/models/produto.model';
import { LoteService } from '../../services/lote.service';
import { Lote } from '../../models/lote.model';
import { AuthService } from '../../../../core/services/auth.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  template: `
    <section class="lotes-page">
      <div class="page-header">
        <div>
          <span class="eyebrow">PRODUÇÃO</span>
          <h2>Abertura de lotes</h2>
          <p>Crie novos lotes de produção usando os produtos cadastrados no sistema.</p>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <h3>Novo lote</h3>

          <form [formGroup]="loteForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="produtoId">Produto</label>
              <select id="produtoId" formControlName="produtoId">
                <option value="">Selecione um produto</option>
                @for (produto of produtos; track produto.id) {
                  <option [value]="produto.id">
                    {{ produto.codigo }} - {{ produto.nome }}
                  </option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="data_producao">Data de produção</label>
              <input
                id="data_producao"
                type="date"
                formControlName="data_producao"
              />
            </div>

            <div class="form-group">
              <label for="turno">Turno</label>
              <select id="turno" formControlName="turno">
                <option value="">Selecione o turno</option>
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
            </div>

            <div class="form-group">
              <label for="quantidade_prod">Quantidade produzida</label>
              <input
                id="quantidade_prod"
                type="number"
                formControlName="quantidade_prod"
              />
            </div>

            <div class="form-group">
              <label for="observacoes">Observações</label>
              <textarea
                id="observacoes"
                rows="3"
                formControlName="observacoes"
              ></textarea>
            </div>

            @if (errorMessage) {
              <div class="alert error">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="alert success">{{ successMessage }}</div>
            }

            <button type="submit" [disabled]="saving">
              {{ saving ? 'Salvando...' : 'Abrir lote' }}
            </button>
          </form>
        </section>

        <section class="list-card">
          <div class="list-header">
            <h3>Lotes recentes</h3>
            <button type="button" class="secondary-btn" (click)="loadLotes()">
              Atualizar
            </button>
          </div>

          @if (loading) {
            <div class="feedback-box">
              <p>Carregando lotes...</p>
            </div>
          } @else if (lotes.length > 0) {
            <div class="mobile-lote-list">
              @for (lote of lotes; track lote.id) {
                <article class="mobile-lote-card">
                  <div class="mobile-lote-top">
                    <strong>{{ lote.numero_lote }}</strong>
                    <app-status-badge [status]="lote.status" />
                  </div>

                  <div class="mobile-lote-info">
                    <span><b>Produto:</b> {{ lote.produto.nome }}</span>
                    <span><b>Turno:</b> {{ formatTurno(lote.turno) }}</span>
                    <span><b>Quantidade:</b> {{ lote.quantidade_prod }}</span>
                  </div>

                  <div class="mobile-lote-actions">
                    <button
                      type="button"
                      class="details-btn"
                      (click)="openDetails(lote)"
                    >
                      Detalhes
                    </button>
                  </div>
                </article>
              }
            </div>

            <div class="table-wrapper desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Produto</th>
                    <th>Turno</th>
                    <th>Quantidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  @for (lote of lotes; track lote.id) {
                    <tr>
                      <td class="strong">{{ lote.numero_lote }}</td>
                      <td>{{ lote.produto.nome }}</td>
                      <td>{{ formatTurno(lote.turno) }}</td>
                      <td>{{ lote.quantidade_prod }}</td>
                      <td>
                        <app-status-badge [status]="lote.status" />
                      </td>
                      <td>
                        <button
                          type="button"
                          class="details-btn"
                          (click)="openDetails(lote)"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <app-empty-state
              title="Nenhum lote cadastrado"
              description="Abra o primeiro lote para iniciar o controle de produção."
            />
          }
        </section>
      </div>

      @if (selectedLote) {
        <div class="modal-backdrop" (click)="closeDetails()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <span class="modal-eyebrow">DETALHES DO LOTE</span>
                <h3>{{ selectedLote.numero_lote }}</h3>
              </div>

              <button
                type="button"
                class="close-btn"
                (click)="closeDetails()"
              >
                Fechar
              </button>
            </div>

            <div class="modal-grid">
              <div class="info-item">
                <span class="info-label">Produto</span>
                <strong>{{ selectedLote.produto.nome }}</strong>
              </div>

              <div class="info-item">
                <span class="info-label">Código do produto</span>
                <strong>{{ selectedLote.produto.codigo }}</strong>
              </div>

              <div class="info-item">
                <span class="info-label">Operador</span>
                <strong>{{ selectedLote.operador.nome }}</strong>
              </div>

              <div class="info-item">
                <span class="info-label">Data de produção</span>
                <strong>{{ formatDate(selectedLote.data_producao) }}</strong>
              </div>

              <div class="info-item">
                <span class="info-label">Turno</span>
                <strong>{{ formatTurno(selectedLote.turno) }}</strong>
              </div>

              <div class="info-item">
                <span class="info-label">Status</span>
                <app-status-badge [status]="selectedLote.status" />
              </div>

              <div class="info-item">
                <span class="info-label">Quantidade produzida</span>
                <strong>{{ selectedLote.quantidade_prod }}</strong>
              </div>

              <div class="info-item">
                <span class="info-label">Quantidade reprovada</span>
                <strong>{{ selectedLote.quantidade_repr }}</strong>
              </div>

              <div class="info-item full-width">
                <span class="info-label">Observações</span>
                <p class="info-text">
                  {{ selectedLote.observacoes || 'Nenhuma observação informada.' }}
                </p>
              </div>

              <div class="info-item full-width">
                <span class="info-label">Encerrado em</span>
                <p class="info-text">
                  {{
                    selectedLote.encerrado_em
                      ? formatDateTime(selectedLote.encerrado_em)
                      : 'Lote ainda não encerrado.'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .lotes-page {
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
        line-height: 1.1;
      }

      .page-header p {
        color: #64748b;
        max-width: 720px;
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

      .details-btn {
        background: #e0f2fe;
        color: #0369a1;
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

      .feedback-box {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 18px;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      .desktop-table {
        display: block;
      }

      .mobile-lote-list {
        display: none;
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

      .mobile-lote-card {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mobile-lote-list {
        gap: 12px;
        flex-direction: column;
      }

      .mobile-lote-top {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .mobile-lote-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: #334155;
        font-size: 14px;
      }

      .mobile-lote-actions {
        display: flex;
        justify-content: flex-start;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        z-index: 30;
      }

      .modal-card {
        width: 100%;
        max-width: 840px;
        max-height: 90vh;
        overflow-y: auto;
        background: #ffffff;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
      }

      .modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
      }

      .modal-eyebrow {
        display: inline-block;
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #2563eb;
      }

      .modal-header h3 {
        font-size: 28px;
        color: #0f172a;
      }

      .close-btn {
        background: #e2e8f0;
        color: #0f172a;
      }

      .modal-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .info-item {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .info-label {
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #64748b;
        text-transform: uppercase;
      }

      .info-item strong {
        color: #0f172a;
      }

      .info-text {
        color: #334155;
        line-height: 1.6;
      }

      @media (max-width: 1100px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .page-header h2 {
          font-size: 26px;
        }

        .form-card,
        .list-card {
          padding: 18px;
          border-radius: 18px;
        }

        .list-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .desktop-table {
          display: none;
        }

        .mobile-lote-list {
          display: flex;
        }

        .modal-grid {
          grid-template-columns: 1fr;
        }

        .modal-header {
          flex-direction: column;
          align-items: stretch;
        }

        .modal-card {
          padding: 18px;
          border-radius: 18px;
        }
      }

      @media (max-width: 480px) {
        .page-header h2 {
          font-size: 22px;
        }

        .page-header p {
          font-size: 14px;
          line-height: 1.5;
        }

        .form-card,
        .list-card {
          padding: 16px;
        }

        .modal-backdrop {
          padding: 12px;
        }

        .modal-header h3 {
          font-size: 22px;
        }
      }
    `,
  ],
})
export class LotesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private loteService = inject(LoteService);
  private authService = inject(AuthService);

  produtos: Produto[] = [];
  lotes: Lote[] = [];
  selectedLote: Lote | null = null;
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  loteForm = this.fb.group({
    produtoId: ['', [Validators.required]],
    data_producao: ['', [Validators.required]],
    turno: ['', [Validators.required]],
    quantidade_prod: [null as number | null, [Validators.required, Validators.min(1)]],
    observacoes: [''],
  });

  ngOnInit(): void {
    this.loadProdutos();
    this.loadLotes();
  }

  loadProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (response) => {
        this.produtos = response.data.filter((produto) => produto.ativo);
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os produtos.';
      },
    });
  }

  loadLotes(): void {
    this.loading = true;

    this.loteService.getLotes().subscribe({
      next: (response) => {
        this.lotes = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar os lotes.';
      },
    });
  }

  openDetails(lote: Lote): void {
    this.selectedLote = lote;
  }

  closeDetails(): void {
    this.selectedLote = null;
  }

  formatTurno(turno: string): string {
    const labels: Record<string, string> = {
      manha: 'Manhã',
      tarde: 'Tarde',
      noite: 'Noite',
    };

    return labels[turno] ?? turno;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  onSubmit(): void {
    if (this.loteForm.invalid) {
      this.loteForm.markAllAsTouched();
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
      produtoId: this.loteForm.value.produtoId ?? '',
      data_producao: this.loteForm.value.data_producao ?? '',
      turno: (this.loteForm.value.turno ?? '') as 'manha' | 'tarde' | 'noite',
      operadorId: user.id,
      quantidade_prod: this.loteForm.value.quantidade_prod ?? 0,
      observacoes: this.loteForm.value.observacoes ?? '',
    };

    this.loteService.createLote(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Lote aberto com sucesso.';
        this.loteForm.reset({
          produtoId: '',
          data_producao: '',
          turno: '',
          quantidade_prod: null,
          observacoes: '',
        });
        this.loadLotes();
      },
      error: (error) => {
        this.saving = false;

        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para abrir lotes.';
          return;
        }

        this.errorMessage = 'Erro ao abrir lote.';
      },
    });
  }
}
