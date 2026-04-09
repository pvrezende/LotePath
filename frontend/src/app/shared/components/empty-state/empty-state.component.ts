import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="icon">📦</div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [
    `
      .empty-state {
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        border: 1px dashed #cbd5e1;
        border-radius: 18px;
        padding: 40px 24px;
        text-align: center;
      }

      .icon {
        font-size: 34px;
        margin-bottom: 14px;
      }

      .empty-state h3 {
        margin-bottom: 8px;
        color: #0f172a;
        font-size: 22px;
      }

      .empty-state p {
        color: #64748b;
        line-height: 1.6;
        max-width: 500px;
        margin: 0 auto;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
}
