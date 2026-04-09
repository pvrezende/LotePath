import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoteStatus } from '../../../features/dashboard/models/dashboard.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="status">
      {{ label }}
    </span>
  `,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 140px;
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        text-transform: capitalize;
      }

      .em_producao {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .aguardando_inspecao {
        background: #fef3c7;
        color: #b45309;
      }

      .aprovado {
        background: #dcfce7;
        color: #15803d;
      }

      .aprovado_restricao {
        background: #ffedd5;
        color: #c2410c;
      }

      .reprovado {
        background: #fee2e2;
        color: #b91c1c;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: LoteStatus;

  get label(): string {
    const labels: Record<LoteStatus, string> = {
      em_producao: 'Em produção',
      aguardando_inspecao: 'Aguardando inspeção',
      aprovado: 'Aprovado',
      aprovado_restricao: 'Aprovado com restrição',
      reprovado: 'Reprovado',
    };

    return labels[this.status];
  }
}
