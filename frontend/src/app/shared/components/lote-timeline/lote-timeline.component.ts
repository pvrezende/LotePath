import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lote } from '../../../features/lotes/models/lote.model';
import { AuditLog } from '../../../features/auditoria/models/audit-log.model';

type TimelineEventType = 'criacao' | 'insumo' | 'inspecao' | 'status';

interface TimelineEvent {
  type: TimelineEventType;
  title: string;
  description: string;
  date: string | null;
  user?: string | null;
}

@Component({
  selector: 'app-lote-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="timeline-card">
      <div class="timeline-header">
        <div>
          <span class="timeline-eyebrow">HISTÓRICO DO LOTE</span>
          <h4>Linha do tempo</h4>
          <p>
            Acompanhe a evolução do lote desde a abertura até as movimentações
            de insumos e inspeção.
          </p>
        </div>

        <span class="timeline-chip">{{ events.length }} evento(s)</span>
      </div>

      <div class="timeline-list">
        @for (event of events; track event.title + event.description + event.date) {
          <article class="timeline-item">
            <div class="timeline-marker" [ngClass]="event.type">
              {{ getIcon(event.type) }}
            </div>

            <div class="timeline-content">
              <div class="timeline-content-header">
                <strong>{{ event.title }}</strong>
                <span>{{ event.date ? formatDateTime(event.date) : 'Sem data registrada' }}</span>
              </div>

              <p>{{ event.description }}</p>

              @if (event.user) {
                <small>Responsável: {{ event.user }}</small>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .timeline-card {
        margin-top: 24px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 20px;
      }

      .timeline-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
      }

      .timeline-eyebrow {
        display: inline-flex;
        margin-bottom: 8px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.08em;
        color: #2563eb;
      }

      .timeline-header h4 {
        margin: 0 0 6px;
        color: #0f172a;
        font-size: 22px;
      }

      .timeline-header p {
        margin: 0;
        color: #64748b;
        line-height: 1.6;
      }

      .timeline-chip {
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

      .timeline-list {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .timeline-list::before {
        content: '';
        position: absolute;
        top: 26px;
        bottom: 26px;
        left: 22px;
        width: 2px;
        background: #dbeafe;
      }

      .timeline-item {
        position: relative;
        display: grid;
        grid-template-columns: 46px 1fr;
        gap: 14px;
      }

      .timeline-marker {
        position: relative;
        z-index: 1;
        width: 46px;
        height: 46px;
        border-radius: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border: 4px solid #ffffff;
      }

      .timeline-marker.criacao {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .timeline-marker.insumo {
        background: #fef3c7;
        color: #b45309;
      }

      .timeline-marker.inspecao {
        background: #dcfce7;
        color: #15803d;
      }

      .timeline-marker.status {
        background: #e0e7ff;
        color: #4338ca;
      }

      .timeline-content {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 14px;
      }

      .timeline-content-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
      }

      .timeline-content-header strong {
        color: #0f172a;
      }

      .timeline-content-header span {
        color: #64748b;
        font-size: 12px;
        white-space: nowrap;
      }

      .timeline-content p {
        margin: 0;
        color: #334155;
        line-height: 1.5;
      }

      .timeline-content small {
        display: inline-flex;
        margin-top: 8px;
        color: #64748b;
        font-weight: 700;
      }

      @media (max-width: 640px) {
        .timeline-header,
        .timeline-content-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class LoteTimelineComponent {
  @Input({ required: true }) lote!: Lote;
  @Input() auditLogs: AuditLog[] = [];

  get events(): TimelineEvent[] {
    if (!this.lote) return [];

    const events: TimelineEvent[] = [
      {
        type: 'criacao',
        title: 'Lote aberto',
        description: `Lote ${this.lote.numero_lote} aberto para o produto ${this.lote.produto.nome}.`,
        date: this.lote.data_producao,
        user: this.lote.operador?.nome,
      },
    ];

    const logsDoLote = this.auditLogs.filter((log) => {
      const detalhes = log.detalhes as { loteId?: string; numero_lote?: string } | null;

      return (
        detalhes?.loteId === this.lote.id ||
        detalhes?.numero_lote === this.lote.numero_lote
      );
    });

    for (const log of logsDoLote) {
      events.push({
        type: log.modulo === 'inspecao' ? 'inspecao' : 'insumo',
        title: this.formatAction(log.acao),
        description: log.descricao,
        date: log.criado_em,
        user: log.usuario_nome,
      });
    }

    if (this.lote.inspecao) {
      events.push({
        type: 'inspecao',
        title: 'Inspeção registrada',
        description: `Resultado da inspeção: ${this.formatResultado(this.lote.inspecao.resultado)}.`,
        date: this.lote.inspecao.inspecionado_em,
        user: 'Inspetor responsável',
      });
    }

    if (this.lote.status !== 'em_producao') {
      events.push({
        type: 'status',
        title: 'Status atual do lote',
        description: `Status atual: ${this.formatStatus(this.lote.status)}.`,
        date: this.lote.encerrado_em || this.lote.inspecao?.inspecionado_em || this.lote.data_producao,
        user: null,
      });
    }

    return events.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      return dateA - dateB;
    });
  }

  getIcon(type: TimelineEventType): string {
    const icons: Record<TimelineEventType, string> = {
      criacao: '🚀',
      insumo: '🧩',
      inspecao: '✅',
      status: '🏁',
    };

    return icons[type];
  }

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

  formatResultado(resultado: string): string {
    const labels: Record<string, string> = {
      aprovado: 'Aprovado',
      aprovado_restricao: 'Aprovado com restrição',
      reprovado: 'Reprovado',
    };

    return labels[resultado] ?? resultado;
  }

  formatStatus(status: string): string {
    const labels: Record<string, string> = {
      em_producao: 'Em produção',
      aguardando_inspecao: 'Aguardando inspeção',
      aprovado: 'Aprovado',
      aprovado_restricao: 'Aprovado com restrição',
      reprovado: 'Reprovado',
    };

    return labels[status] ?? status;
  }
}
