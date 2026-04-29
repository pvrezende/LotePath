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
      <div class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow">RASTREABILIDADE</span>
          <h2>Consulta inteligente de rastreabilidade</h2>
          <p>
            Pesquise por lote ou por insumo para identificar vínculos de
            produção, dependências operacionais e cenários de recall com uma
            experiência mais visual.
          </p>
        </div>

        <div class="hero-badge">
          <span class="hero-label">Consultas disponíveis</span>
          <strong>2 modos</strong>
          <small>por lote ou por insumo</small>
        </div>
      </div>

      <div class="search-grid">
        <section class="search-card">
          <div class="card-header">
            <div>
              <h3>Buscar por lote</h3>
              <p>Informe o ID do lote para visualizar os detalhes completos.</p>
            </div>
            <span class="card-chip">Lote</span>
          </div>

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

            <button type="submit" class="primary-btn" [disabled]="loadingLote">
              {{ loadingLote ? 'Buscando...' : 'Buscar lote' }}
            </button>
          </form>
        </section>

        <section class="search-card">
          <div class="card-header">
            <div>
              <h3>Buscar por insumo</h3>
              <p>Informe o código ou lote do insumo para localizar impactos.</p>
            </div>
            <span class="card-chip">Insumo</span>
          </div>

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

            <button type="submit" class="primary-btn" [disabled]="loadingInsumo">
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
            <div>
              <h3>Resultado por lote</h3>
              <p>Detalhamento completo do lote consultado.</p>
            </div>
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
                  <p><b>Resultado:</b> {{ formatResultado(loteResult.lote.inspecao.resultado) }}</p>
                  <p><b>Quantidade reprovada:</b> {{ loteResult.lote.inspecao.quantidade_repr }}</p>
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
                <div class="mobile-list">
                  @for (insumo of loteResult.lote.insumos; track insumo.id) {
                    <article class="mobile-card">
                      <strong>{{ insumo.nome_insumo }}</strong>
                      <span><b>Código:</b> {{ insumo.codigo_insumo }}</span>
                      <span><b>Lote:</b> {{ insumo.lote_insumo }}</span>
                      <span><b>Quantidade:</b> {{ insumo.quantidade }}</span>
                      <span><b>Unidade:</b> {{ insumo.unidade }}</span>
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
            <div>
              <h3>Resultado por insumo</h3>
              <p>Veja os lotes afetados pelo insumo informado.</p>
            </div>
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
                <div class="mobile-list">
                  @for (lote of insumoResult.lotesAfetados; track lote.id) {
                    <article class="mobile-card">
                      <div class="mobile-head">
                        <strong>{{ lote.numero_lote }}</strong>
                        <app-status-badge [status]="lote.status" />
                      </div>
                      <span><b>Produto:</b> {{ lote.produto.nome }}</span>
                      <span><b>Operador:</b> {{ lote.operador.nome }}</span>
                      <span><b>Data:</b> {{ formatDate(lote.data_producao) }}</span>
                    </article>
                  }
                </div>

                <div class="table-wrapper desktop-table">
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

      .hero-card,
      .search-card,
      .result-card {
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

      .search-grid,
      .results-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      .search-card,
      .result-card {
        border-radius: 24px;
        padding: 24px;
      }

      .card-header,
      .section-header {
        margin-bottom: 18px;
      }

      .card-header h3,
      .section-header h3 {
        margin: 0 0 4px;
        font-size: 24px;
        color: #0f172a;
      }

      .card-header p,
      .section-header p {
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

      input {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
        transition: border-color 0.18s ease, box-shadow 0.18s ease;
      }

      input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .primary-btn {
        height: 44px;
        padding: 0 16px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
        transition: 0.2s ease;
      }

      .primary-btn:hover {
        transform: translateY(-1px);
      }

      .alert {
        border-radius: 12px;
        padding: 12px 14px;
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

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .info-card,
      .inspection-box,
      .insumo-highlight,
      .mobile-card {
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

      .info-card strong,
      .info-card p {
        color: #0f172a;
        margin: 0;
      }

      .subsection {
        margin-top: 24px;
      }

      .subsection h4 {
        margin: 0 0 14px;
        color: #0f172a;
      }

      .inspection-box p,
      .insumo-highlight p {
        margin-bottom: 8px;
      }

      .table-wrapper {
        overflow-x: auto;
        border-radius: 18px;
      }

      .desktop-table {
        display: block;
      }

      .mobile-list {
        display: none;
        flex-direction: column;
        gap: 12px;
      }

      .mobile-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .mobile-head {
        display: flex;
        flex-direction: column;
        gap: 10px;
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

        .search-grid,
        .results-grid,
        .info-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .hero-card,
        .search-card,
        .result-card {
          padding: 18px;
          border-radius: 20px;
        }

        .hero-copy h2 {
          font-size: 30px;
        }

        .desktop-table {
          display: none;
        }

        .mobile-list {
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
        this.errorMessage =
          'Não foi possível encontrar a rastreabilidade do lote informado.';
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
        this.errorMessage =
          'Não foi possível encontrar a rastreabilidade do insumo informado.';
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

  formatResultado(
    resultado: 'aprovado' | 'aprovado_restricao' | 'reprovado'
  ): string {
    const labels = {
      aprovado: 'Aprovado',
      aprovado_restricao: 'Aprovado com restrição',
      reprovado: 'Reprovado',
    };

    return labels[resultado] ?? resultado;
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
