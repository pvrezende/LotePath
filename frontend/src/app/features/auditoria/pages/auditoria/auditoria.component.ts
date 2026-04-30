import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditLog } from '../../models/audit-log.model';
import { AuditoriaService } from '../../services/auditoria.service';

type ModuloFilter = 'todos' | 'produtos' | 'lotes' | 'insumos' | 'inspecao';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="auditoria-page">
      <div class="hero-card">
        <div class="hero-copy">
          <span class="eyebrow">AUDITORIA CENTRALIZADA</span>
          <h2>Auditoria do sistema</h2>
          <p>
            Consulte todas as ações importantes registradas no LotePath em um só
            lugar: produtos, lotes, insumos e inspeções.
          </p>
        </div>

        <div class="hero-badge">
          <span class="hero-label">Registros exibidos</span>
          <strong>{{ logsFiltrados().length }}</strong>
          <small>de {{ logs.length }} auditoria(s)</small>
        </div>
      </div>

      <section class="filters-card">
        <div class="filter-group search-group">
          <label for="searchTerm">Buscar auditoria</label>
          <input
            id="searchTerm"
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Busque por ação, usuário ou descrição"
          />
        </div>

        <div class="filter-group">
          <label for="moduloFilter">Módulo</label>
          <select
            id="moduloFilter"
            [ngModel]="moduloFilter()"
            (ngModelChange)="moduloFilter.set($event)"
          >
            <option value="todos">Todos</option>
            <option value="produtos">Produtos</option>
            <option value="lotes">Lotes</option>
            <option value="insumos">Insumos</option>
            <option value="inspecao">Inspeção</option>
          </select>
        </div>

        <button type="button" class="clear-btn" (click)="clearFilters()">
          Limpar filtros
        </button>
      </section>

      <section class="list-card">
        <div class="card-header">
          <div>
            <h3>Registros de auditoria</h3>
            <p>
              Histórico centralizado das operações realizadas pelos usuários do
              sistema.
            </p>
          </div>

          <button type="button" class="secondary-btn" (click)="loadLogs()">
            Atualizar
          </button>
        </div>

        @if (loading) {
          <div class="feedback-box">
            <div class="loading-line"></div>
            <p>Carregando auditoria...</p>
          </div>
        } @else if (logsFiltrados().length > 0) {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Módulo</th>
                  <th>Ação</th>
                  <th>Usuário</th>
                  <th>Perfil</th>
                  <th>Descrição</th>
                </tr>
              </thead>

              <tbody>
                @for (log of logsFiltrados(); track log.id) {
                  <tr>
                    <td>{{ formatDateTime(log.criado_em) }}</td>
                    <td>
                      <span class="module-chip" [class]="log.modulo">
                        {{ formatModulo(log.modulo) }}
                      </span>
                    </td>
                    <td class="strong">{{ formatAction(log.acao) }}</td>
                    <td>{{ log.usuario_nome || '-' }}</td>
                    <td>{{ formatPerfil(log.usuario_perfil) }}</td>
                    <td>{{ log.descricao }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="empty-box">
            <span>🧾</span>
            <strong>Nenhum registro encontrado</strong>
            <p>Ajuste os filtros ou realize uma ação auditável no sistema.</p>
          </div>
        }
      </section>
    </section>
  `,
  styles: [
    `
      .auditoria-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .hero-card,
      .filters-card,
      .list-card,
      .feedback-box {
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
        font-weight: 900;
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
        font-weight: 900;
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

      .filters-card {
        border-radius: 20px;
        padding: 18px;
        display: grid;
        grid-template-columns: minmax(240px, 1fr) 220px auto;
        gap: 14px;
        align-items: end;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      label {
        font-weight: 800;
        color: #334155;
      }

      input,
      select {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
      }

      input:focus,
      select:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
      }

      .clear-btn,
      .secondary-btn {
        min-height: 44px;
        padding: 0 16px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        background: #f1f5f9;
        color: #0f172a;
        font-weight: 800;
        cursor: pointer;
      }

      .list-card,
      .feedback-box {
        border-radius: 24px;
        padding: 24px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 18px;
      }

      .card-header h3 {
        margin: 0 0 4px;
        font-size: 24px;
        color: #0f172a;
      }

      .card-header p {
        margin: 0;
        color: #64748b;
      }

      .table-wrapper {
        overflow-x: auto;
        border-radius: 18px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 900px;
      }

      th,
      td {
        text-align: left;
        padding: 15px 12px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: top;
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

      .strong {
        font-weight: 800;
      }

      .module-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 30px;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 900;
        background: #eff6ff;
        color: #1d4ed8;
      }

      .module-chip.produtos {
        background: #fef3c7;
        color: #b45309;
      }

      .module-chip.lotes {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .module-chip.insumos {
        background: #ecfdf5;
        color: #15803d;
      }

      .module-chip.inspecao {
        background: #e0e7ff;
        color: #4338ca;
      }

      .empty-box {
        min-height: 220px;
        border: 1px dashed #bfdbfe;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
        text-align: center;
        color: #64748b;
      }

      .empty-box span {
        font-size: 32px;
      }

      .empty-box strong {
        color: #0f172a;
        font-size: 18px;
      }

      .empty-box p {
        margin: 0;
      }

      .loading-line {
        width: 160px;
        height: 10px;
        border-radius: 999px;
        margin-bottom: 14px;
        background: linear-gradient(90deg, #dbeafe 0%, #93c5fd 50%, #dbeafe 100%);
        animation: pulse 1.4s infinite ease-in-out;
      }

      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }

      @media (max-width: 900px) {
        .hero-card,
        .card-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .filters-card {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AuditoriaComponent implements OnInit {
  private auditoriaService = inject(AuditoriaService);

  logs: AuditLog[] = [];
  loading = true;

  searchTerm = signal('');
  moduloFilter = signal<ModuloFilter>('todos');

  logsFiltrados = computed(() => {
    const term = this.normalize(this.searchTerm());
    const modulo = this.moduloFilter();

    return this.logs.filter((log) => {
      const matchesModulo = modulo === 'todos' || log.modulo === modulo;

      const matchesTerm =
        !term ||
        this.normalize(log.acao).includes(term) ||
        this.normalize(log.descricao).includes(term) ||
        this.normalize(log.usuario_nome).includes(term) ||
        this.normalize(log.usuario_perfil).includes(term);

      return matchesModulo && matchesTerm;
    });
  });

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;

    this.auditoriaService.getLogs().subscribe({
      next: (response) => {
        this.logs = response.data;
        this.loading = false;
      },
      error: () => {
        this.logs = [];
        this.loading = false;
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.moduloFilter.set('todos');
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }

  formatModulo(modulo: string): string {
    const labels: Record<string, string> = {
      produtos: 'Produtos',
      lotes: 'Lotes',
      insumos: 'Insumos',
      inspecao: 'Inspeção',
    };

    return labels[modulo] ?? modulo;
  }

  formatPerfil(perfil: string | null | undefined): string {
    if (!perfil) {
      return '-';
    }

    const labels: Record<string, string> = {
      gestor: 'Gestor',
      operador: 'Operador',
      inspetor: 'Inspetor',
    };

    return labels[perfil] ?? perfil;
  }

  formatAction(action: string): string {
    const labels: Record<string, string> = {
      PRODUTO_CRIADO: 'Produto criado',
      PRODUTO_ATUALIZADO: 'Produto atualizado',
      PRODUTO_EXCLUIDO: 'Produto excluído',
      INSUMO_ADICIONADO: 'Insumo adicionado',
      INSUMO_REMOVIDO: 'Insumo removido',
      INSPECAO_REGISTRADA: 'Inspeção registrada',
      INSPECAO_EXCLUIDA: 'Inspeção excluída',
      LOTE_CRIADO: 'Lote criado',
      LOTE_ATUALIZADO: 'Lote atualizado',
      LOTE_EXCLUIDO: 'Lote excluído',
      STATUS_LOTE_ATUALIZADO: 'Status do lote atualizado',
    };

    return labels[action] ?? action;
  }

  private normalize(value: string | null | undefined): string {
    return String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
