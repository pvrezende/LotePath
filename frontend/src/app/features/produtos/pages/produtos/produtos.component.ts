import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmptyStateComponent],
  template: `
    <section class="produtos-page">
      <div class="page-header">
        <div>
          <span class="eyebrow">CADASTRO</span>
          <h2>Produtos</h2>
          <p>Cadastre e visualize os produtos disponíveis para abertura de lotes.</p>
        </div>
      </div>

      <div class="content-grid">
        <section class="form-card">
          <h3>Novo produto</h3>

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
              <textarea id="descricao" rows="3" formControlName="descricao"></textarea>
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

            <button type="submit" [disabled]="saving">
              {{ saving ? 'Salvando...' : 'Cadastrar produto' }}
            </button>
          </form>
        </section>

        <section class="list-card">
          <div class="list-header">
            <h3>Produtos cadastrados</h3>
            <button type="button" class="secondary-btn" (click)="loadProdutos()">
              Atualizar
            </button>
          </div>

          @if (loading) {
            <div class="feedback-box">
              <p>Carregando produtos...</p>
            </div>
          } @else if (produtos.length > 0) {
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Linha</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (produto of produtos; track produto.id) {
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
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <app-empty-state
              title="Nenhum produto cadastrado"
              description="Cadastre o primeiro produto para começar a abrir lotes no sistema."
            />
          }
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .produtos-page {
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
        grid-template-columns: 380px 1fr;
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
      textarea {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
      }

      input:focus,
      textarea:focus {
        border-color: #2563eb;
      }

      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 8px 0 16px;
      }

      .checkbox-row input {
        width: auto;
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

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        text-align: left;
        padding: 14px 12px;
        border-bottom: 1px solid #e5e7eb;
      }

      th {
        font-size: 13px;
        color: #64748b;
      }

      .strong {
        font-weight: 800;
      }

      .status-chip {
        display: inline-flex;
        padding: 8px 12px;
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

      @media (max-width: 980px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProdutosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);

  produtos: Produto[] = [];
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
      descricao: this.produtoForm.value.descricao ?? '',
      linha: this.produtoForm.value.linha ?? '',
      ativo: this.produtoForm.value.ativo ?? true,
    };

    this.produtoService.createProduto(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Produto cadastrado com sucesso.';
        this.produtoForm.reset({
          codigo: '',
          nome: '',
          descricao: '',
          linha: '',
          ativo: true,
        });
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
            'Seu perfil não tem permissão para cadastrar produtos.';
          return;
        }

        this.errorMessage = 'Erro ao cadastrar produto.';
      },
    });
  }
}
