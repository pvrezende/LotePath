import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="confirm-backdrop" (click)="cancel.emit()">
        <section class="confirm-card" (click)="$event.stopPropagation()">
          <div class="confirm-icon" [ngClass]="variant">
            {{ icon }}
          </div>

          <div class="confirm-content">
            <span class="confirm-eyebrow">{{ eyebrow }}</span>
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
          </div>

          <div class="confirm-actions">
            <button type="button" class="secondary-btn" (click)="cancel.emit()">
              {{ cancelText }}
            </button>

            <button
              type="button"
              class="confirm-btn"
              [ngClass]="variant"
              (click)="confirm.emit()"
            >
              {{ confirmText }}
            </button>
          </div>
        </section>
      </div>
    }
  `,
  styles: [
    `
      .confirm-backdrop {
        position: fixed;
        inset: 0;
        z-index: 100;
        background: rgba(15, 23, 42, 0.52);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      .confirm-card {
        width: 100%;
        max-width: 460px;
        background: #ffffff;
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 28px 80px rgba(15, 23, 42, 0.3);
        animation: dialogIn 0.18s ease-out;
      }

      @keyframes dialogIn {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.98);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .confirm-icon {
        width: 52px;
        height: 52px;
        border-radius: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-bottom: 16px;
      }

      .confirm-icon.danger {
        background: #fee2e2;
        color: #b91c1c;
      }

      .confirm-icon.warning {
        background: #fef3c7;
        color: #b45309;
      }

      .confirm-icon.info {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .confirm-eyebrow {
        display: inline-flex;
        margin-bottom: 8px;
        color: #2563eb;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .confirm-content h3 {
        margin: 0 0 10px;
        color: #0f172a;
        font-size: 24px;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }

      .confirm-content p {
        margin: 0;
        color: #64748b;
        line-height: 1.65;
      }

      .confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }

      .secondary-btn,
      .confirm-btn {
        min-height: 44px;
        padding: 0 16px;
        border-radius: 12px;
        border: none;
        font-weight: 800;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .secondary-btn {
        background: #f1f5f9;
        color: #0f172a;
        border: 1px solid #e2e8f0;
      }

      .confirm-btn.danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 12px 24px rgba(220, 38, 38, 0.2);
      }

      .confirm-btn.warning {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        box-shadow: 0 12px 24px rgba(217, 119, 6, 0.2);
      }

      .confirm-btn.info {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        box-shadow: 0 12px 24px rgba(37, 99, 235, 0.2);
      }

      .secondary-btn:hover,
      .confirm-btn:hover {
        transform: translateY(-1px);
      }

      @media (max-width: 520px) {
        .confirm-card {
          padding: 20px;
          border-radius: 20px;
        }

        .confirm-actions {
          flex-direction: column-reverse;
        }

        .secondary-btn,
        .confirm-btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmar ação';
  @Input() message = 'Deseja realmente continuar?';
  @Input() eyebrow = 'Confirmação';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() variant: ConfirmDialogVariant = 'danger';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get icon(): string {
    const icons: Record<ConfirmDialogVariant, string> = {
      danger: '⚠️',
      warning: ' Atenção',
      info: 'ℹ️',
    };

    return icons[this.variant];
  }
}
