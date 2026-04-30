import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

type StatusFilter = 'todos' | 'ativos' | 'inativos';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <section class="produtos-page">
      <div class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow">CADASTRO</span>
          <h2>Catálogo de produtos</h2>
          <p>
            Cadastre, edite, exclua e filtre os produtos utilizados na abertura
            de lotes, mantendo o portfólio sempre atualizado.
          </p>
        </div>

        <div class="hero-badge">
          <span class="hero-label">Produtos cadastrados</span>
          <strong>{{ produtosFiltrados().length }}</strong>
          <small>de {{ produtos.length }} cadastrado(s)</small>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <div class="card-header">
            <div>
              <h3>{{ editingProdutoId ? 'Editar produto' : 'Novo produto' }}</h3>
              <p>
                {{
                  editingProdutoId
                    ? 'Atualize os dados do produto selecionado.'
                    : 'Preencha os dados para adicionar um novo produto ao sistema.'
                }}
              </p>
            </div>

            <span class="card-chip">
              {{ editingProdutoId ? 'Modo edição' : 'Cadastro' }}
            </span>
          </div>

          <form [formGroup]="produtoForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="codigo">Código</label>
              <input id="codigo" type="text" formControlName="codigo" />
            </div>

            <div class="form-group">
              <label for="nome">Nome</label>
              <input id="nome" type="text" formControlName="nome" />
            </div>

            <div class="form-group">
              <label for="descricao">Descrição</label>
              <textarea
                id="descricao"
                rows="4"
                formControlName="descricao"
                placeholder="Descreva o produto e sua finalidade."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="linha">Linha</label>
              <input id="linha" type="text" formControlName="linha" />
            </div>

            <label class="checkbox-row">
              <input type="checkbox" formControlName="ativo" />
              Produto ativo
            </label>

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
                    : editingProdutoId
                    ? 'Salvar alterações'
                    : 'Cadastrar produto'
                }}
              </button>

              @if (editingProdutoId) {
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
              <h3>Produtos cadastrados</h3>
              <p>Consulte, filtre, edite ou exclua produtos do catálogo.</p>
            </div>

            <div class="list-actions">
              <span class="card-chip">{{ produtosFiltrados().length }} produto(s)</span>
              <button type="button" class="secondary-btn" (click)="loadProdutos()">
                Atualizar
              </button>
            </div>
          </div>



          <div class="filters-card">
            <div class="filter-group search-group">
              <label for="searchTerm">Buscar produto</label>
              <input
                id="searchTerm"
                type="text"
                [ngModel]="searchTerm()"
                (ngModelChange)="searchTerm.set($event)"
                placeholder="Busque por código, nome ou linha"
              />
            </div>

            <div class="filter-group">
              <label for="statusFilter">Status</label>
              <select
                id="statusFilter"
                [ngModel]="statusFilter()"
                (ngModelChange)="statusFilter.set($event)"
              >
                <option value="todos">Todos</option>
                <option value="ativos">Ativos</option>
                <option value="inativos">Inativos</option>
              </select>
            </div>

            <button type="button" class="clear-btn" (click)="clearFilters()">
              Limpar filtros
            </button>
          </div>

          @if (loading) {
            <div class="feedback-box">
              <div class="loading-line"></div>
              <p>Carregando produtos...</p>
            </div>
          } @else if (produtosFiltrados().length > 0) {
            <div class="mobile-product-list">
              @for (produto of produtosFiltrados(); track produto.id) {
                <article class="mobile-product-card">
                  <div class="mobile-product-top">
                    <strong>{{ produto.codigo }}</strong>
                    <span
                      class="status-chip"
                      [class.ativo]="produto.ativo"
                      [class.inativo]="!produto.ativo"
                    >
                      {{ produto.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>

                  <div class="mobile-product-body">
                    <span><b>Nome:</b> {{ produto.nome }}</span>
                    <span><b>Linha:</b> {{ produto.linha }}</span>
                    <span><b>Descrição:</b> {{ produto.descricao || 'Sem descrição.' }}</span>
                  </div>

                  <div class="mobile-actions">
                    <button
                      type="button"
                      class="edit-btn"
                      (click)="startEdit(produto)"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      class="delete-btn"
                      (click)="deleteProduto(produto)"
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              }
            </div>

            <div class="table-wrapper desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Linha</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  @for (produto of produtosFiltrados(); track produto.id) {
                    <tr>
                      <td class="strong">{{ produto.codigo }}</td>
                      <td>{{ produto.nome }}</td>
                      <td>{{ produto.linha }}</td>
                      <td>
                        <span
                          class="status-chip"
                          [class.ativo]="produto.ativo"
                          [class.inativo]="!produto.ativo"
                        >
                          {{ produto.ativo ? 'Ativo' : 'Inativo' }}
                        </span>
                      </td>
                      <td>
                        <div class="table-actions">
                          <button
                            type="button"
                            class="edit-btn"
                            (click)="startEdit(produto)"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            class="delete-btn"
                            (click)="deleteProduto(produto)"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <app-empty-state
              title="Nenhum produto encontrado"
              description="Ajuste os filtros ou cadastre um novo produto."
            />
          }
        </section>
      </div>

      <app-confirm-dialog
        [open]="confirmDialogOpen"
        title="Excluir produto"
        [message]="confirmDialogMessage"
        eyebrow="Ação de gestor"
        confirmText="Excluir produto"
        cancelText="Cancelar"
        variant="danger"
        (confirm)="confirmDeleteProduto()"
        (cancel)="closeConfirmDialog()"
      />
    </section>
  `,
  styles: [
    `
      .produtos-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .hero-card,
      .form-card,
      .list-card,
      .feedback-box,
      .filters-card {
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
        justify-content: space-between;
        align-items: flex-start;
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

      .list-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }


      .filters-card {
        border-radius: 18px;
        padding: 16px;
        margin-bottom: 18px;
        display: grid;
        grid-template-columns: minmax(220px, 1fr) 180px auto;
        gap: 14px;
        align-items: end;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
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
      textarea,
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
      textarea:focus,
      select:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      textarea {
        resize: vertical;
      }

      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 8px 0 16px;
        font-weight: 600;
      }

      .checkbox-row input {
        width: auto;
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
      .edit-btn,
      .delete-btn,
      .clear-btn {
        height: 40px;
        padding: 0 14px;
        border-radius: 12px;
        border: none;
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

      .secondary-btn,
      .clear-btn {
        background: #f1f5f9;
        color: #0f172a;
        border: 1px solid #e2e8f0;
      }

      .edit-btn {
        background: #fef3c7;
        color: #b45309;
      }

      .delete-btn,
      .clear-btn {
        background: #fee2e2;
        color: #b91c1c;
      }

      .primary-btn:hover,
      .secondary-btn:hover,
      .edit-btn:hover,
      .delete-btn:hover,
      .clear-btn:hover {
        transform: translateY(-1px);
      }

      .form-actions,
      .table-actions,
      .mobile-actions {
        display: flex;
        gap: 8px;
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

      .desktop-table {
        display: block;
      }

      .mobile-product-list {
        display: none;
        flex-direction: column;
        gap: 12px;
      }

      .mobile-product-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mobile-product-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }

      .mobile-product-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: #334155;
        font-size: 14px;
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

      tbody tr:hover {
        background: #f8fafc;
      }

      .strong {
        font-weight: 800;
      }

      .status-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 800;
      }

      .status-chip.ativo {
        background: #dcfce7;
        color: #15803d;
      }

      .status-chip.inativo {
        background: #fee2e2;
        color: #b91c1c;
      }

      @media (max-width: 1180px) {
        .hero-card {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      @media (max-width: 980px) {
        .content-grid {
          grid-template-columns: 1fr;
        }

        .filters-card {
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

        .card-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .desktop-table {
          display: none;
        }

        .mobile-product-list {
          display: flex;
        }
      }

      @media (max-width: 480px) {
        .hero-copy h2 {
          font-size: 26px;
        }
      }
    `,
  ],
})
export class ProdutosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);

  produtos: Produto[] = [];
  editingProdutoId: string | null = null;
  produtoPendingDelete: Produto | null = null;
  confirmDialogOpen = false;
  confirmDialogMessage = '';

  searchTerm = signal('');
  statusFilter = signal<StatusFilter>('todos');

  produtosFiltrados = computed(() => {
    const term = this.normalize(this.searchTerm());
    const status = this.statusFilter();

    return this.produtos.filter((produto) => {
      const matchesTerm =
        !term ||
        this.normalize(produto.codigo).includes(term) ||
        this.normalize(produto.nome).includes(term) ||
        this.normalize(produto.linha).includes(term);

      const matchesStatus =
        status === 'todos' ||
        (status === 'ativos' && produto.ativo) ||
        (status === 'inativos' && !produto.ativo);

      return matchesTerm && matchesStatus;
    });
  });

  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  produtoForm = this.fb.group({
    codigo: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    descricao: [''],
    linha: ['', [Validators.required]],
    ativo: [true, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.loading = true;

    this.produtoService.getProdutos().subscribe({
      next: (response) => {
        this.produtos = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar os produtos.';
      },
    });
  }

  onSubmit(): void {
    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      codigo: this.produtoForm.value.codigo ?? '',
      nome: this.produtoForm.value.nome ?? '',
      descricao: this.produtoForm.value.descricao?.trim() || null,
      linha: this.produtoForm.value.linha ?? '',
      ativo: this.produtoForm.value.ativo ?? true,
    };

    const request$ = this.editingProdutoId
      ? this.produtoService.updateProduto(this.editingProdutoId, payload)
      : this.produtoService.createProduto(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.editingProdutoId
          ? 'Produto atualizado com sucesso.'
          : 'Produto cadastrado com sucesso.';
        this.cancelEdit();
        this.loadProdutos();
      },
      error: (error) => {
        this.saving = false;

        if (error.status === 409) {
          this.errorMessage = 'Já existe um produto com esse código.';
          return;
        }

        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para salvar produtos.';
          return;
        }

        if (error.status === 400) {
          this.errorMessage =
            'Dados inválidos. Verifique os campos preenchidos.';
          return;
        }

        this.errorMessage = this.editingProdutoId
          ? 'Erro ao atualizar produto.'
          : 'Erro ao cadastrar produto.';
      },
    });
  }

  startEdit(produto: Produto): void {
    this.editingProdutoId = produto.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.produtoForm.patchValue({
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao ?? '',
      linha: produto.linha,
      ativo: produto.ativo,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingProdutoId = null;
    this.produtoForm.reset({
      codigo: '',
      nome: '',
      descricao: '',
      linha: '',
      ativo: true,
    });
  }

  deleteProduto(produto: Produto): void {
    this.produtoPendingDelete = produto;
    this.confirmDialogMessage = `Tem certeza que deseja excluir o produto ${produto.codigo} - ${produto.nome}? Essa ação não poderá ser desfeita.`;
    this.confirmDialogOpen = true;
  }

  closeConfirmDialog(): void {
    this.confirmDialogOpen = false;
    this.produtoPendingDelete = null;
    this.confirmDialogMessage = '';
  }

  confirmDeleteProduto(): void {
    if (!this.produtoPendingDelete) return;

    const produto = this.produtoPendingDelete;

    this.errorMessage = '';
    this.successMessage = '';
    this.closeConfirmDialog();

    this.produtoService.deleteProduto(produto.id).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Produto excluído com sucesso.';

        if (this.editingProdutoId === produto.id) {
          this.cancelEdit();
        }

        this.loadProdutos();
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage =
            'Seu perfil não tem permissão para excluir produtos.';
          return;
        }

        if (error.status === 409) {
          this.errorMessage =
            error.error?.message ||
            'Não é possível excluir este produto porque ele possui lotes vinculados.';
          return;
        }

        this.errorMessage = 'Erro ao excluir produto.';
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('todos');
  }

  private normalize(value: string | null | undefined): string {
    return String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
