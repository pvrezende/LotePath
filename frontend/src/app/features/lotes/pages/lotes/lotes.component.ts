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
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lotes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    StatusBadgeComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <section class="lotes-page">
      <div class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow">PRODUÇÃO</span>
          <h2>Abertura e gestão de lotes</h2>
          <p>
            Registre novos lotes, acompanhe os mais recentes e administre as
            informações operacionais com mais controle visual e agilidade.
          </p>
        </div>

        <div class="hero-badge">
          <span class="hero-label">Lotes exibidos</span>
          <strong>{{ lotes.length }}</strong>
          <small>registros carregados</small>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <div class="card-header">
            <div>
              <h3>{{ editingLoteId ? 'Editar lote' : 'Novo lote' }}</h3>
              <p>
                {{
                  editingLoteId
                    ? 'Atualize os dados do lote selecionado.'
                    : 'Preencha os dados para abrir um novo lote de produção.'
                }}
              </p>
            </div>

            <span class="card-chip">
              {{ editingLoteId ? 'Modo edição' : 'Novo registro' }}
            </span>
          </div>

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

            <div class="form-row">
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
                rows="4"
                formControlName="observacoes"
                placeholder="Descreva observações relevantes do lote."
              ></textarea>
            </div>

            @if (errorMessage) {
              <div class="alert error">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="alert success">{{ successMessage }}</div>
            }

            <div class="form-actions">
              <button type="submit" class="primary-btn" [disabled]="saving">
                {{
                  saving
                    ? 'Salvando...'
                    : editingLoteId
                    ? 'Salvar alterações'
                    : 'Abrir lote'
                }}
              </button>

              @if (editingLoteId) {
                <button
                  type="button"
                  class="secondary-btn"
                  (click)="cancelEdit()"
                >
                  Cancelar edição
                </button>
              }
            </div>
          </form>
        </section>

        <section class="list-card">
          <div class="card-header">
            <div>
              <h3>Lotes recentes</h3>
              <p>Visualize, edite e consulte os lotes mais recentes do sistema.</p>
            </div>

            <div class="list-actions">
              <span class="card-chip">{{ lotes.length }} lote(s)</span>
              <button type="button" class="secondary-btn" (click)="loadLotes()">
                Atualizar
              </button>
            </div>
          </div>

          @if (loading) {
            <div class="feedback-box">
              <div class="loading-line"></div>
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
                    <span><b>Data:</b> {{ formatDate(lote.data_producao) }}</span>
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

                    @if (isGestor) {
                      <button
                        type="button"
                        class="edit-btn"
                        (click)="startEdit(lote)"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        class="delete-btn"
                        (click)="deleteLote(lote)"
                      >
                        Excluir
                      </button>
                    }
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
                    <th>Data</th>
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
                      <td>{{ formatDate(lote.data_producao) }}</td>
                      <td>{{ formatTurno(lote.turno) }}</td>
                      <td>{{ lote.quantidade_prod }}</td>
                      <td>
                        <app-status-badge [status]="lote.status" />
                      </td>
                      <td>
                        <div class="table-actions">
                          <button
                            type="button"
                            class="details-btn"
                            (click)="openDetails(lote)"
                          >
                            Detalhes
                          </button>

                          @if (isGestor) {
                            <button
                              type="button"
                              class="edit-btn"
                              (click)="startEdit(lote)"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              class="delete-btn"
                              (click)="deleteLote(lote)"
                            >
                              Excluir
                            </button>
                          }
                        </div>
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
                class="secondary-btn"
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

      <app-confirm-dialog
        [open]="confirmDialogOpen"
        title="Excluir lote"
        [message]="confirmDialogMessage"
        eyebrow="Ação de gestor"
        confirmText="Excluir lote"
        cancelText="Cancelar"
        variant="danger"
        (confirm)="confirmDeleteLote()"
        (cancel)="closeConfirmDialog()"
      />
    </section>
  `,
  styles: [
    `
      .lotes-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .hero-card,
      .form-card,
      .list-card,
      .modal-card,
      .feedback-box {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
      }

      .hero-card {
        border-radius: 24px;
        padding: 28px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        background:
          radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 32%),
          rgba(255, 255, 255, 0.92);
      }

      .eyebrow,
      .modal-eyebrow {
        display: inline-flex;
        margin-bottom: 10px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #2563eb;
      }

      .hero-copy h2 {
        font-size: 38px;
        line-height: 1.05;
        letter-spacing: -0.03em;
        margin: 0 0 10px;
        color: #0f172a;
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
        color: #0f172a;
        line-height: 1;
        margin-bottom: 6px;
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
        color: #0f172a;
        font-size: 24px;
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

      .list-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
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
      select,
      textarea {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
        transition: border-color 0.18s ease, box-shadow 0.18s ease;
      }

      input:focus,
      select:focus,
      textarea:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      textarea {
        resize: vertical;
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
      .details-btn,
      .edit-btn,
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

      .details-btn,
      .edit-btn,
      .delete-btn {
        height: 38px;
        padding: 0 12px;
        font-size: 13px;
      }

      .details-btn {
        background: #e0f2fe;
        color: #0369a1;
      }

      .edit-btn {
        background: #fef3c7;
        color: #b45309;
      }

      .delete-btn {
        background: #fee2e2;
        color: #b91c1c;
      }

      .primary-btn:hover,
      .secondary-btn:hover,
      .details-btn:hover,
      .edit-btn:hover,
      .delete-btn:hover {
        transform: translateY(-1px);
      }

      .form-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .feedback-box {
        border-radius: 18px;
        padding: 20px;
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

      .table-wrapper {
        overflow-x: auto;
        border-radius: 18px;
      }

      .desktop-table {
        display: block;
      }

      .mobile-lote-list {
        display: none;
        flex-direction: column;
        gap: 12px;
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
        font-size: 14px;
        color: #0f172a;
      }

      tbody tr:hover {
        background: #f8fafc;
      }

      .strong {
        font-weight: 800;
      }

      .table-actions,
      .mobile-lote-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .mobile-lote-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
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
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        background: #ffffff;
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
      }

      .modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
      }

      .modal-header h3 {
        font-size: 30px;
        color: #0f172a;
        line-height: 1.1;
        margin: 0;
      }

      .modal-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .info-item {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
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
        .list-card,
        .modal-card {
          padding: 18px;
          border-radius: 20px;
        }

        .hero-copy h2 {
          font-size: 30px;
        }

        .card-header,
        .modal-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .desktop-table {
          display: none;
        }

        .mobile-lote-list {
          display: flex;
        }

        .modal-grid,
        .form-row {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 480px) {
        .hero-copy h2 {
          font-size: 26px;
        }

        .modal-backdrop {
          padding: 12px;
        }

        .modal-header h3 {
          font-size: 24px;
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
  editingLoteId: string | null = null;
  lotePendingDelete: Lote | null = null;
  confirmDialogOpen = false;
  confirmDialogMessage = '';

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

  get isGestor(): boolean {
    return this.authService.getUser()?.perfil === 'gestor';
  }

  ngOnInit(): void {
    this.loadProdutos();
    this.loadLotes();
  }

  loadProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (response) => {
        this.produtos = response.data;
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

        if (this.selectedLote) {
          this.selectedLote =
            this.lotes.find((item) => item.id === this.selectedLote?.id) ?? null;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar os lotes.';
      },
    });
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
      turno: this.loteForm.value.turno as 'manha' | 'tarde' | 'noite',
      operadorId: user.id,
      quantidade_prod: this.loteForm.value.quantidade_prod ?? 0,
      observacoes: this.loteForm.value.observacoes?.trim() || null,
    };

    const request$ = this.editingLoteId
      ? this.loteService.updateLote(this.editingLoteId, payload)
      : this.loteService.createLote(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.editingLoteId
          ? 'Lote atualizado com sucesso.'
          : 'Lote aberto com sucesso.';
        this.cancelEdit();
        this.loadLotes();
      },
      error: (error) => {
        this.saving = false;

        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para salvar lotes.';
          return;
        }

        if (error.status === 400) {
          this.errorMessage =
            'Dados inválidos para salvar o lote. Verifique os campos preenchidos.';
          return;
        }

        this.errorMessage = this.editingLoteId
          ? 'Erro ao atualizar lote.'
          : 'Erro ao abrir lote.';
      },
    });
  }

  startEdit(lote: Lote): void {
    this.editingLoteId = lote.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.loteForm.patchValue({
      produtoId: lote.produto.id,
      data_producao: String(lote.data_producao).slice(0, 10),
      turno: lote.turno,
      quantidade_prod: lote.quantidade_prod,
      observacoes: lote.observacoes ?? '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingLoteId = null;
    this.loteForm.reset({
      produtoId: '',
      data_producao: '',
      turno: '',
      quantidade_prod: null,
      observacoes: '',
    });
  }

  deleteLote(lote: Lote): void {
    if (!this.isGestor) return;

    this.lotePendingDelete = lote;
    this.confirmDialogMessage = `Tem certeza que deseja excluir o lote ${lote.numero_lote}? Essa ação não poderá ser desfeita.`;
    this.confirmDialogOpen = true;
  }

  closeConfirmDialog(): void {
    this.confirmDialogOpen = false;
    this.lotePendingDelete = null;
    this.confirmDialogMessage = '';
  }

  confirmDeleteLote(): void {
    if (!this.lotePendingDelete || !this.isGestor) return;

    const lote = this.lotePendingDelete;

    this.errorMessage = '';
    this.successMessage = '';
    this.closeConfirmDialog();

    this.loteService.deleteLote(lote.id).subscribe({
      next: (response: any) => {
        this.successMessage = response?.message || 'Lote excluído com sucesso.';
        if (this.selectedLote?.id === lote.id) {
          this.selectedLote = null;
        }
        if (this.editingLoteId === lote.id) {
          this.cancelEdit();
        }
        this.loadLotes();
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para excluir lotes.';
          return;
        }

        this.errorMessage = 'Erro ao excluir lote.';
      },
    });
  }

  openDetails(lote: Lote): void {
    this.selectedLote = lote;
    document.body.classList.add('modal-open');
  }

  closeDetails(): void {
    this.selectedLote = null;
    document.body.classList.remove('modal-open');
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
    const raw = String(date).slice(0, 10);
    const [year, month, day] = raw.split('-');

    if (!year || !month || !day) return String(date);

    return `${day}/${month}/${year}`;
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}
