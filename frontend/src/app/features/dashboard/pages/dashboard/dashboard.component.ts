import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardIndicadores,
  DashboardLote,
} from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard.service';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatCardComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
  ],
  template: `
    <section class="dashboard-page">
      <div class="page-header">
        <div>
          <span class="eyebrow">PAINEL OPERACIONAL</span>
          <h2>Dashboard de Produção</h2>
          <p>
            Acompanhe indicadores do período filtrado para monitorar o processo produtivo.
          </p>
        </div>
      </div>

      <section class="filter-card">
        <div class="filter-header">
          <div>
            <h3>Filtro por período</h3>
            <p>Por padrão, a dashboard abre com o intervalo do dia atual.</p>
          </div>
        </div>

        <div class="quick-filters">
          <button type="button" class="quick-btn" (click)="setToday()">
            Hoje
          </button>
          <button type="button" class="quick-btn" (click)="setYesterday()">
            Ontem
          </button>
          <button type="button" class="quick-btn" (click)="setLast7Days()">
            Últimos 7 dias
          </button>
          <button type="button" class="quick-btn" (click)="setCurrentMonth()">
            Este mês
          </button>
        </div>

        <div class="filter-grid">
          <div class="form-group">
            <label for="dataInicial">Data inicial</label>
            <input
              id="dataInicial"
              type="date"
              [(ngModel)]="startDate"
            />
          </div>

          <div class="form-group">
            <label for="dataFinal">Data final</label>
            <input
              id="dataFinal"
              type="date"
              [(ngModel)]="endDate"
            />
          </div>

          <div class="filter-actions">
            <button type="button" (click)="applyFilter()">Filtrar</button>
            <button type="button" class="secondary-btn" (click)="resetFilter()">
              Limpar
            </button>
          </div>
        </div>

        <div class="filter-note">
          <span>
            Exibindo dados de:
            <strong>{{ formatDate(startDate) }}</strong>
            até
            <strong>{{ formatDate(endDate) }}</strong>
          </span>
        </div>
      </section>

      @if (loading) {
        <div class="feedback-box">
          <div class="loading-line"></div>
          <p>Carregando dados do dashboard...</p>
        </div>
      } @else if (errorMessage) {
        <div class="feedback-box error">
          <h3>Não foi possível carregar o dashboard</h3>
          <p>{{ errorMessage }}</p>
        </div>
      } @else {
        <div class="stats-grid">
          <app-stat-card
            label="Lotes produzidos no período"
            [value]="indicadores.lotesProduzidosHoje"
          />
          <app-stat-card
            label="Unidades produzidas no período"
            [value]="indicadores.unidadesProduzidasHoje"
          />
          <app-stat-card
            label="Taxa de aprovação do mês"
            [value]="indicadores.taxaAprovacaoMes + '%'"
          />
          <app-stat-card
            label="Lotes pendentes no período"
            [value]="indicadores.lotesAguardandoInspecao"
          />
        </div>

        <section class="table-section">
          <div class="section-header">
            <div>
              <h3>Lotes do período filtrado</h3>
              <p>
                Lotes encontrados entre
                {{ formatDate(startDate) }}
                e
                {{ formatDate(endDate) }}.
              </p>
            </div>

            <span class="section-chip">
              {{ ultimosLotes.length }} lote(s)
            </span>
          </div>

          @if (ultimosLotes.length > 0) {
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
                  @for (lote of ultimosLotes; track lote.id) {
                    <tr>
                      <td class="strong">{{ lote.numero_lote }}</td>
                      <td>{{ lote.produto }}</td>
                      <td>{{ lote.operador }}</td>
                      <td>{{ lote.data_producao }}</td>
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
              title="Nenhum lote encontrado"
              [description]="'Não existem lotes entre ' + formatDate(startDate) + ' e ' + formatDate(endDate) + '.'"
            />
          }
        </section>
      }
    </section>
  `,
  styles: [
    `
      .dashboard-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
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
        line-height: 1.6;
        max-width: 760px;
      }

      .filter-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
      }

      .filter-header h3 {
        margin-bottom: 4px;
        font-size: 20px;
        color: #0f172a;
      }

      .filter-header p {
        color: #64748b;
      }

      .quick-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 18px;
        margin-bottom: 18px;
      }

      .filter-grid {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 16px;
        align-items: end;
      }

      .form-group {
        min-width: 0;
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

      .filter-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
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

      .quick-btn {
        height: 40px;
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
      }

      .quick-btn:hover {
        background: #dbeafe;
      }

      .filter-note {
        margin-top: 16px;
        color: #475569;
        font-size: 14px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .table-section {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .section-header h3 {
        margin-bottom: 4px;
        font-size: 22px;
        color: #0f172a;
      }

      .section-header p {
        color: #64748b;
      }

      .section-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
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
        padding: 16px 12px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: middle;
      }

      th {
        font-size: 13px;
        color: #64748b;
        font-weight: 800;
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

      .feedback-box {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        padding: 28px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
      }

      .feedback-box.error {
        background: #fff7f7;
        border-color: #fecaca;
        color: #b91c1c;
      }

      .feedback-box.error h3 {
        margin-bottom: 8px;
      }

      .loading-line {
        width: 180px;
        height: 10px;
        border-radius: 999px;
        margin-bottom: 16px;
        background: linear-gradient(90deg, #dbeafe 0%, #93c5fd 50%, #dbeafe 100%);
        animation: pulse 1.4s infinite ease-in-out;
      }

      @keyframes pulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.6;
        }
      }

      @media (max-width: 1100px) {
        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .filter-grid {
          grid-template-columns: 1fr 1fr;
        }

        .filter-actions {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 720px) {
        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .filter-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .page-header h2 {
          font-size: 28px;
        }

        .table-section,
        .filter-card {
          padding: 18px;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  loading = true;
  errorMessage = '';
  startDate = this.getTodayDate();
  endDate = this.getTodayDate();

  indicadores: DashboardIndicadores = {
    lotesProduzidosHoje: 0,
    unidadesProduzidasHoje: 0,
    taxaAprovacaoMes: 0,
    lotesAguardandoInspecao: 0,
  };

  ultimosLotes: DashboardLote[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  private getTodayDate(): string {
    const today = new Date();
    return this.toInputDate(today);
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private addDays(baseDate: Date, days: number): Date {
    const result = new Date(baseDate);
    result.setDate(result.getDate() + days);
    return result;
  }

  formatDate(date: string): string {
    if (!date) return '';

    const [year, month, day] = date.split('-');

    if (!year || !month || !day) {
      return date;
    }

    return `${day}/${month}/${year}`;
  }

  applyFilter(): void {
    if (this.startDate > this.endDate) {
      this.errorMessage = 'A data inicial não pode ser maior que a data final.';
      return;
    }

    this.loadDashboard();
  }

  resetFilter(): void {
    this.setToday();
  }

  setToday(): void {
    const today = this.getTodayDate();
    this.startDate = today;
    this.endDate = today;
    this.loadDashboard();
  }

  setYesterday(): void {
    const yesterday = this.addDays(new Date(), -1);
    const formatted = this.toInputDate(yesterday);
    this.startDate = formatted;
    this.endDate = formatted;
    this.loadDashboard();
  }

  setLast7Days(): void {
    const today = new Date();
    const start = this.addDays(today, -6);
    this.startDate = this.toInputDate(start);
    this.endDate = this.toInputDate(today);
    this.loadDashboard();
  }

  setCurrentMonth(): void {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = this.toInputDate(start);
    this.endDate = this.toInputDate(today);
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard(this.startDate, this.endDate).subscribe({
      next: (response) => {
        this.indicadores = response.indicadores;
        this.ultimosLotes = response.ultimosLotes;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 400) {
          this.errorMessage = 'Período inválido para o filtro.';
          return;
        }

        if (error.status === 401) {
          this.errorMessage = 'Sua sessão expirou. Faça login novamente.';
          return;
        }

        if (error.status === 403) {
          this.errorMessage = 'Você não tem permissão para acessar o dashboard.';
          return;
        }

        if (error.status === 0) {
          this.errorMessage =
            'Não foi possível conectar ao backend do dashboard.';
          return;
        }

        this.errorMessage = 'Erro ao carregar os dados do dashboard.';
      },
    });
  }
}
