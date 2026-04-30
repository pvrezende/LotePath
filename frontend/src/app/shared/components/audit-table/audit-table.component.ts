import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLog } from '../../../features/auditoria/models/audit-log.model';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-audit-table',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  template: `
    <section class="audit-card">
      <div class="audit-header">
        <div>
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>

        <span class="audit-chip">{{ logs.length }} registro(s)</span>
      </div>

      @if (logs.length > 0) {
        <div class="audit-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Ação</th>
                <th>Funcionário</th>
                <th>Perfil</th>
                <th>Descrição</th>
              </tr>
            </thead>

            <tbody>
              @for (log of logs; track log.id) {
                <tr>
                  <td>{{ formatDateTime(log.criado_em) }}</td>
                  <td>
                    <span class="action-pill">{{ formatAction(log.acao) }}</span>
                  </td>
                  <td>{{ log.usuario_nome || 'Não identificado' }}</td>
                  <td>{{ formatPerfil(log.usuario_perfil) }}</td>
                  <td>{{ log.descricao }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <app-empty-state
          title="Nenhuma movimentação registrada"
          description="Quando houver ações nesta tela, elas aparecerão aqui como histórico de auditoria."
        />
      }
    </section>
  `,
  styles: [
    `
      .audit-card {
        margin-top: 24px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
      }

      .audit-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
        margin-bottom: 18px;
      }

      .audit-header h3 {
        margin: 0 0 4px;
        color: #0f172a;
        font-size: 24px;
      }

      .audit-header p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
      }

      .audit-chip,
      .action-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
      }

      .audit-chip {
        min-height: 34px;
        padding: 0 12px;
        background: #eff6ff;
        color: #1d4ed8;
      }

      .action-pill {
        min-height: 30px;
        padding: 0 10px;
        background: #f1f5f9;
        color: #334155;
      }

      .audit-table-wrapper {
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
        padding: 14px 12px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: middle;
      }

      th {
        font-size: 12px;
        color: #64748b;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      td {
        color: #0f172a;
        font-size: 14px;
      }

      tbody tr:hover {
        background: #f8fafc;
      }

      @media (max-width: 768px) {
        .audit-card {
          padding: 18px;
          border-radius: 20px;
        }

        .audit-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class AuditTableComponent {
  @Input({ required: true }) logs: AuditLog[] = [];
  @Input() title = 'Auditoria';
  @Input() description = 'Histórico de movimentações registradas no sistema.';

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  formatAction(action: string): string {
    const labels: Record<string, string> = {
      INSUMO_ADICIONADO: 'Insumo adicionado',
      INSUMO_REMOVIDO: 'Insumo removido',
      INSPECAO_REGISTRADA: 'Inspeção registrada',
      INSPECAO_EXCLUIDA: 'Inspeção excluída',
    };

    return labels[action] ?? action;
  }

  formatPerfil(perfil: string | null): string {
    if (!perfil) return 'Não identificado';

    const labels: Record<string, string> = {
      operador: 'Operador',
      inspetor: 'Inspetor',
      gestor: 'Gestor',
    };

    return labels[perfil] ?? perfil;
  }
}
