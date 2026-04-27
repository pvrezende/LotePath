import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RastreabilidadeService } from '../../services/rastreabilidade.service';
import {
  RastreabilidadeInsumoResponse,
  RastreabilidadeLoteResponse,
} from '../../models/rastreabilidade.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-rastreabilidade',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  template: `
    <section class="rastreabilidade-page">
      <div class="page-header">
        <div>
          <span class="eyebrow">RASTREABILIDADE</span>
          <h2>Consulta de rastreabilidade</h2>
          <p>
            Pesquise por lote ou por insumo para identificar vínculos de produção
            e cenários de recall.
          </p>
        </div>
      </div>

      <div class="search-grid">
        <section class="search-card">
          <h3>Buscar por lote</h3>

          <form [formGroup]="loteForm" (ngSubmit)="searchByLote()">
            <div class="form-group">
              <label for="loteId">ID do lote</label>
              <input
                id="loteId"
                type="text"
                formControlName="loteId"
                placeholder="Cole o ID do lote"
              />
            </div>

            <button type="submit" [disabled]="loadingLote">
              {{ loadingLote ? 'Buscando...' : 'Buscar lote' }}
            </button>
          </form>
        </section>

        <section class="search-card">
          <h3>Buscar por insumo</h3>

          <form [formGroup]="insumoForm" (ngSubmit)="searchByInsumo()">
            <div class="form-group">
              <label for="valor">Lote ou código do insumo</label>
              <input
                id="valor"
                type="text"
                formControlName="valor"
                placeholder="Ex.: INS-001 ou LOTE-ABS-2026-01"
              />
            </div>

            <button type="submit" [disabled]="loadingInsumo">
              {{ loadingInsumo ? 'Buscando...' : 'Buscar insumo' }}
            </button>
          </form>
        </section>
      </div>

      @if (errorMessage) {
        <div class="alert error">{{ errorMessage }}</div>
      }

      @if (successMessage) {
        <div class="alert success">{{ successMessage }}</div>
      }

      <div class="results-grid">
        <section class="result-card">
          <div class="section-header">
            <h3>Resultado por lote</h3>
          </div>

          @if (!loteResult) {
            <app-empty-state
              title="Nenhum lote consultado"
              description="Faça uma busca por ID do lote para visualizar os detalhes completos."
            />
          } @else {
            <div class="info-grid">
              <div class="info-card">
                <span class="info-label">Número do lote</span>
                <strong>{{ loteResult.lote.numero_lote }}</strong>
              </div>

              <div class="info-card">
                <span class="info-label">Status</span>
                <app-status-badge [status]="loteResult.lote.status" />
              </div>

              <div class="info-card">
                <span class="info-label">Produto</span>
                <strong>{{ loteResult.lote.produto.nome }}</strong>
              </div>

              <div class="info-card">
                <span class="info-label">Linha</span>
                <strong>{{ loteResult.lote.produto.linha }}</strong>
              </div>

              <div class="info-card">
                <span class="info-label">Operador</span>
                <strong>{{ loteResult.lote.operador.nome }}</strong>
              </div>

              <div class="info-card">
                <span class="info-label">Data de produção</span>
                <strong>{{ formatDate(loteResult.lote.data_producao) }}</strong>
              </div>

              <div class="info-card">
                <span class="info-label">Turno</span>
                <strong>{{ formatTurno(loteResult.lote.turno) }}</strong>
              </div>

              <div class="info-card">
                <span class="info-label">Quantidade produzida</span>
                <strong>{{ loteResult.lote.quantidade_prod }}</strong>
              </div>

              <div class="info-card">
                <span class="info-label">Quantidade reprovada</span>
                <strong>{{ loteResult.lote.quantidade_repr }}</strong>
              </div>

              <div class="info-card full-width">
                <span class="info-label">Observações</span>
                <p>{{ loteResult.lote.observacoes || 'Nenhuma observação informada.' }}</p>
              </div>
            </div>

            <div class="subsection">
              <h4>Inspeção</h4>

              @if (loteResult.lote.inspecao) {
                <div class="inspection-box">
                  <p>
                    <b>Resultado:</b>
                    {{ formatResultado(loteResult.lote.inspecao.resultado) }}
                  </p>
                  <p>
                    <b>Quantidade reprovada:</b>
                    {{ loteResult.lote.inspecao.quantidade_repr }}
                  </p>
                  <p>
                    <b>Descrição do desvio:</b>
                    {{ loteResult.lote.inspecao.descricao_desvio || 'Nenhum desvio informado.' }}
                  </p>
                  <p>
                    <b>Inspecionado em:</b>
                    {{ formatDateTime(loteResult.lote.inspecao.inspecionado_em) }}
                  </p>
                </div>
              } @else {
                <app-empty-state
                  title="Sem inspeção registrada"
                  description="Este lote ainda não possui inspeção vinculada."
                />
              }
            </div>

            <div class="subsection">
              <h4>Insumos vinculados</h4>

              @if (loteResult.lote.insumos && loteResult.lote.insumos.length > 0) {
                <div class="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Código</th>
                        <th>Lote do insumo</th>
                        <th>Quantidade</th>
                        <th>Unidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (insumo of loteResult.lote.insumos; track insumo.id) {
                        <tr>
                          <td class="strong">{{ insumo.nome_insumo }}</td>
                          <td>{{ insumo.codigo_insumo }}</td>
                          <td>{{ insumo.lote_insumo }}</td>
                          <td>{{ insumo.quantidade }}</td>
                          <td>{{ insumo.unidade }}</td>
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
            </div>
          }
        </section>

        <section class="result-card">
          <div class="section-header">
            <h3>Resultado por insumo</h3>
          </div>

          @if (!insumoResult) {
            <app-empty-state
              title="Nenhum insumo consultado"
              description="Pesquise por lote ou código do insumo para visualizar os lotes afetados."
            />
          } @else {
            <div class="insumo-highlight">
              <p><b>Nome:</b> {{ insumoResult.insumo.nome_insumo }}</p>
              <p><b>Código:</b> {{ insumoResult.insumo.codigo_insumo }}</p>
              <p><b>Lote do insumo:</b> {{ insumoResult.insumo.lote_insumo }}</p>
            </div>

            <div class="subsection">
              <h4>Lotes afetados</h4>

              @if (insumoResult.lotesAfetados.length > 0) {
                <div class="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Número do lote</th>
                        <th>Produto</th>
                        <th>Operador</th>
                        <th>Data</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (lote of insumoResult.lotesAfetados; track lote.id) {
                        <tr>
                          <td class="strong">{{ lote.numero_lote }}</td>
                          <td>{{ lote.produto.nome }}</td>
                          <td>{{ lote.operador.nome }}</td>
                          <td>{{ formatDate(lote.data_producao) }}</td>
                          <td>
                            <app-status-badge [status]="lote.status" />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <app-empty-state
                  title="Nenhum lote afetado"
                  description="Nenhum lote foi encontrado para o insumo informado."
                />
              }
            </div>
          }
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .rastreabilidade-page {
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

      .search-grid,
      .results-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      .search-card,
      .result-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
      }

      .search-card h3,
      .section-header h3 {
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

      input {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
      }

      input:focus {
        border-color: #2563eb;
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

      .alert {
        border-radius: 10px;
        padding: 12px;
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

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .info-card,
      .inspection-box,
      .insumo-highlight {
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

      .subsection {
        margin-top: 24px;
      }

      .subsection h4 {
        margin-bottom: 14px;
        color: #0f172a;
      }

      .inspection-box p,
      .insumo-highlight p {
        margin-bottom: 8px;
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
        .search-grid,
        .results-grid,
        .info-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .page-header h2 {
          font-size: 26px;
        }

        .search-card,
        .result-card {
          padding: 18px;
        }
      }
    `,
  ],
})
export class RastreabilidadeComponent {
  private fb = inject(FormBuilder);
  private rastreabilidadeService = inject(RastreabilidadeService);

  loadingLote = false;
  loadingInsumo = false;
  errorMessage = '';
  successMessage = '';

  loteResult: RastreabilidadeLoteResponse | null = null;
  insumoResult: RastreabilidadeInsumoResponse | null = null;

  loteForm = this.fb.group({
    loteId: ['', [Validators.required]],
  });

  insumoForm = this.fb.group({
    valor: ['', [Validators.required]],
  });

  searchByLote(): void {
    if (this.loteForm.invalid) {
      this.loteForm.markAllAsTouched();
      return;
    }

    const loteId = this.loteForm.value.loteId?.trim() ?? '';
    if (!loteId) return;

    this.loadingLote = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.rastreabilidadeService.getRastreabilidadePorLote(loteId).subscribe({
      next: (response) => {
        this.loteResult = response;
        this.loadingLote = false;
        this.successMessage = 'Rastreabilidade por lote carregada com sucesso.';
      },
      error: () => {
        this.loadingLote = false;
        this.loteResult = null;
        this.errorMessage = 'Não foi possível encontrar a rastreabilidade do lote informado.';
      },
    });
  }

  searchByInsumo(): void {
    if (this.insumoForm.invalid) {
      this.insumoForm.markAllAsTouched();
      return;
    }

    const valor = this.insumoForm.value.valor?.trim() ?? '';
    if (!valor) return;

    this.loadingInsumo = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.rastreabilidadeService.getRastreabilidadePorInsumo(valor).subscribe({
      next: (response) => {
        this.insumoResult = response;
        this.loadingInsumo = false;
        this.successMessage = 'Rastreabilidade por insumo carregada com sucesso.';
      },
      error: () => {
        this.loadingInsumo = false;
        this.insumoResult = null;
        this.errorMessage = 'Não foi possível encontrar resultados para o insumo informado.';
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}
