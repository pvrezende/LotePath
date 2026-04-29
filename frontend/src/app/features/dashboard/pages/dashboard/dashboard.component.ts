import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardIndicadores,
  DashboardLote,
} from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    EmptyStateComponent,
  ],
  template: `
    <section class="dashboard-page">
      <div class="hero-card">
        <div class="hero-content">
          <div>
            <span class="eyebrow">PAINEL OPERACIONAL</span>
            <h2>Dashboard de Produção</h2>
            <p>
              Acompanhe indicadores do período filtrado para monitorar o processo
              produtivo, a performance operacional e a situação dos lotes.
            </p>
          </div>

          <div class="hero-highlight">
            <span class="hero-label">Período em análise</span>
            <strong>{{ formatDate(startDate) }}</strong>
            <small>até {{ formatDate(endDate) }}</small>
          </div>
        </div>
      </div>

      <section class="filter-card">
        <div class="filter-header">
          <div>
            <h3>Filtro por período</h3>
            <p>
              Use os atalhos rápidos ou escolha manualmente a data inicial e a
              data final para consultar a operação.
            </p>
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
            <input id="dataInicial" type="date" [(ngModel)]="startDate" />
          </div>

          <div class="form-group">
            <label for="dataFinal">Data final</label>
            <input id="dataFinal" type="date" [(ngModel)]="endDate" />
          </div>

          <div class="filter-actions">
            <button type="button" class="primary-btn" (click)="applyFilter()">
              Filtrar
            </button>
            <button
              type="button"
              class="secondary-btn"
              (click)="resetFilter()"
            >
              Limpar
            </button>
          </div>
        </div>

        <div class="filter-note">
          <span class="filter-note-dot"></span>
          <span>
            Exibindo dados de <strong>{{ formatDate(startDate) }}</strong> até
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
          <article class="stat-panel">
            <div class="stat-top">
              <span class="stat-label">Lotes produzidos</span>
              <span class="stat-icon">📦</span>
            </div>
            <strong class="stat-value">{{ indicadores.lotesProduzidosHoje }}</strong>
            <small class="stat-caption">No período selecionado</small>
          </article>

          <article class="stat-panel">
            <div class="stat-top">
              <span class="stat-label">Unidades produzidas</span>
              <span class="stat-icon">🏭</span>
            </div>
            <strong class="stat-value">{{ indicadores.unidadesProduzidasHoje }}</strong>
            <small class="stat-caption">Volume total produzido</small>
          </article>

          <article class="stat-panel">
            <div class="stat-top">
              <span class="stat-label">Taxa de aprovação</span>
              <span class="stat-icon">✅</span>
            </div>
            <strong class="stat-value">{{ indicadores.taxaAprovacaoMes }}%</strong>
            <small class="stat-caption">Com base no mês de referência</small>
          </article>

          <article class="stat-panel">
            <div class="stat-top">
              <span class="stat-label">Lotes pendentes</span>
              <span class="stat-icon">⏳</span>
            </div>
            <strong class="stat-value">{{ indicadores.lotesAguardandoInspecao }}</strong>
            <small class="stat-caption">Aguardando inspeção no período</small>
          </article>
        </div>

        <section class="table-section">
          <div class="section-header">
            <div>
              <h3>Lotes do período filtrado</h3>
              <p>
                Lotes encontrados entre {{ formatDate(startDate) }} e
                {{ formatDate(endDate) }}.
              </p>
            </div>

            <span class="section-chip">
              {{ ultimosLotes.length }} lote(s)
            </span>
          </div>

          @if (ultimosLotes.length > 0) {
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

            <div class="mobile-lote-list">
              @for (lote of ultimosLotes; track lote.id) {
                <article class="mobile-lote-card">
                  <div class="mobile-lote-head">
                    <strong>{{ lote.numero_lote }}</strong>
                    <app-status-badge [status]="lote.status" />
                  </div>

                  <div class="mobile-lote-body">
                    <span><b>Produto:</b> {{ lote.produto }}</span>
                    <span><b>Operador:</b> {{ lote.operador }}</span>
                    <span><b>Data:</b> {{ lote.data_producao }}</span>
                  </div>
                </article>
              }
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

      .hero-card,
      .filter-card,
      .table-section,
      .feedback-box {
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 24px;
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }

      .hero-card {
        padding: 18px 20px;
        position: relative;
        overflow: hidden;
      }

      .hero-copy h2 {
        font-size: 26px;
        line-height: 1.1;
        margin: 0 0 6px;
      }

      .hero-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 32%),
          radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.08), transparent 28%);
        pointer-events: none;
      }

      .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
      }

      .eyebrow {
        display: inline-flex;
        margin-bottom: 12px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #2563eb;
      }

      .hero-card h2 {
        font-size: 38px;
        line-height: 1.05;
        margin: 0 0 10px;
        color: #0f172a;
        letter-spacing: -0.03em;
      }

      .hero-card p {
        max-width: 760px;
        color: #64748b;
        line-height: 1.7;
        margin: 0;
      }

      .hero-highlight {
        min-width: 220px;
        padding: 18px 20px;
        border-radius: 20px;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 1px solid #bfdbfe;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
      }

      .hero-label {
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #2563eb;
      }

      .hero-highlight strong {
        font-size: 24px;
        color: #0f172a;
        line-height: 1.1;
      }

      .hero-highlight small {
        color: #475569;
        font-size: 13px;
      }

      .filter-card,
      .table-section,
      .feedback-box {
        padding: 24px;
      }

      .filter-header h3,
      .section-header h3 {
        margin: 0 0 4px;
        font-size: 22px;
        color: #0f172a;
        letter-spacing: -0.02em;
      }

      .filter-header p,
      .section-header p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
      }

      .quick-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 18px 0;
      }

      .quick-btn {
        height: 40px;
        padding: 0 14px;
        border: 1px solid #bfdbfe;
        border-radius: 12px;
        background: #eff6ff;
        color: #1d4ed8;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .quick-btn:hover {
        background: #dbeafe;
        transform: translateY(-1px);
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
        margin-bottom: 7px;
        font-weight: 700;
        color: #334155;
      }

      input {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 13px 14px;
        outline: none;
        background: #fff;
        transition: border-color 0.18s ease, box-shadow 0.18s ease;
      }

      input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .filter-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .primary-btn,
      .secondary-btn {
        height: 44px;
        padding: 0 18px;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .primary-btn {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
      }

      .primary-btn:hover {
        transform: translateY(-1px);
      }

      .secondary-btn {
        background: #f1f5f9;
        color: #0f172a;
        border: 1px solid #e2e8f0;
      }

      .secondary-btn:hover {
        background: #e2e8f0;
      }

      .filter-note {
        margin-top: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #475569;
        font-size: 14px;
      }

      .filter-note-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: #2563eb;
        box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.12);
        flex-shrink: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .stat-panel {
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        border: 1px solid #e2e8f0;
        border-radius: 22px;
        padding: 22px;
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
      }

      .stat-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }

      .stat-label {
        font-size: 13px;
        font-weight: 800;
        color: #64748b;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .stat-icon {
        font-size: 18px;
      }

      .stat-value {
        display: block;
        font-size: 42px;
        line-height: 1;
        letter-spacing: -0.04em;
        color: #0f172a;
        margin-bottom: 10px;
      }

      .stat-caption {
        color: #64748b;
        font-size: 14px;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .section-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
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
        padding: 16px 14px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: middle;
      }

      th {
        font-size: 12px;
        color: #64748b;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
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

      .mobile-lote-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .mobile-lote-head {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .mobile-lote-body {
        display: flex;
        flex-direction: column;
        gap: 7px;
        color: #334155;
        font-size: 14px;
      }

      .feedback-box {
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
      }

      .feedback-box.error {
        background: #fff7f7;
        border-color: #fecaca;
        color: #b91c1c;
      }

      .feedback-box.error h3 {
        margin: 0 0 8px;
      }

      .feedback-box.error p {
        margin: 0;
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

      @media (max-width: 1180px) {
        .hero-content {
          flex-direction: column;
          align-items: flex-start;
        }

        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 980px) {
        .filter-grid {
          grid-template-columns: 1fr 1fr;
        }

        .filter-actions {
          grid-column: 1 / -1;
        }
      }

      @media (max-width: 720px) {
        .hero-card,
        .filter-card,
        .table-section,
        .feedback-box {
          padding: 18px;
          border-radius: 20px;
        }

        .hero-card h2 {
          font-size: 30px;
        }

        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .filter-grid {
          grid-template-columns: 1fr;
        }

        .desktop-table {
          display: none;
        }

        .mobile-lote-list {
          display: flex;
        }
      }

      @media (max-width: 640px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .stat-value {
          font-size: 34px;
        }

        .quick-filters {
          gap: 8px;
        }

        .quick-btn {
          flex: 1 1 140px;
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
