import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardIndicadores,
  DashboardLote,
} from '../../models/dashboard.model';
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
          <h2>Dashboard de Produção</h2>
          <p>
            Visão geral da operação, indicadores do dia e últimos lotes
            registrados.
          </p>
        </div>
      </div>

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
          <h3>Últimos lotes</h3>
          <p>Lista dos 10 lotes mais recentes para acompanhamento rápido.</p>
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
    </section>
  `,
  styles: [
    `
      .dashboard-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .page-header h2 {
        font-size: 28px;
        margin-bottom: 8px;
      }

      .page-header p {
        color: #6b7280;
        line-height: 1.5;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .table-section {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
      }

      .section-header {
        margin-bottom: 16px;
      }

      .section-header h3 {
        margin-bottom: 4px;
      }

      .section-header p {
        color: #6b7280;
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
        color: #6b7280;
        font-weight: 700;
      }

      td {
        font-size: 14px;
        color: #111827;
      }

      .strong {
        font-weight: 700;
      }

      @media (max-width: 1100px) {
        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  indicadores: DashboardIndicadores = {
    lotesProduzidosHoje: 8,
    unidadesProduzidasHoje: 1240,
    taxaAprovacaoMes: 96,
    lotesAguardandoInspecao: 3,
  };

  ultimosLotes: DashboardLote[] = [
    {
      id: '1',
      numero_lote: 'LOT-2026-00021',
      produto: 'Placa Eletrônica A',
      operador: 'Operador Teste',
      data_producao: '09/04/2026',
      status: 'em_producao',
    },
    {
      id: '2',
      numero_lote: 'LOT-2026-00020',
      produto: 'Módulo Sensor B',
      operador: 'Operador Teste',
      data_producao: '09/04/2026',
      status: 'aguardando_inspecao',
    },
    {
      id: '3',
      numero_lote: 'LOT-2026-00019',
      produto: 'Painel de Controle C',
      operador: 'Operador Teste',
      data_producao: '08/04/2026',
      status: 'aprovado',
    },
    {
      id: '4',
      numero_lote: 'LOT-2026-00018',
      produto: 'Placa Eletrônica A',
      operador: 'Operador Teste',
      data_producao: '08/04/2026',
      status: 'aprovado_restricao',
    },
    {
      id: '5',
      numero_lote: 'LOT-2026-00017',
      produto: 'Módulo Sensor B',
      operador: 'Operador Teste',
      data_producao: '07/04/2026',
      status: 'reprovado',
    },
  ];
}
