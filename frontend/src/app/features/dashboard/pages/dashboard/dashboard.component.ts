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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
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
            Acompanhe indicadores do dia e os últimos lotes registrados para
            monitorar o processo produtivo.
          </p>
        </div>
      </div>

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
            label="Lotes produzidos hoje"
            [value]="indicadores.lotesProduzidosHoje"
          />
          <app-stat-card
            label="Unidades produzidas hoje"
            [value]="indicadores.unidadesProduzidasHoje"
          />
          <app-stat-card
            label="Taxa de aprovação do mês"
            [value]="indicadores.taxaAprovacaoMes + '%'"
          />
          <app-stat-card
            label="Lotes aguardando inspeção"
            [value]="indicadores.lotesAguardandoInspecao"
          />
        </div>

        <section class="table-section">
          <div class="section-header">
            <div>
              <h3>Últimos lotes</h3>
              <p>Os 10 lotes mais recentes registrados no sistema.</p>
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
              description="Ainda não existem lotes suficientes para exibir no dashboard."
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
      }

      @media (max-width: 720px) {
        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      @media (max-width: 640px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .page-header h2 {
          font-size: 28px;
        }

        .table-section {
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

  private loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.indicadores = response.indicadores;
        this.ultimosLotes = response.ultimosLotes;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

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
