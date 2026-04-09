import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [
    `
      .empty-state {
        background: #ffffff;
        border: 1px dashed #d1d5db;
        border-radius: 16px;
        padding: 32px;
        text-align: center;
      }

      .empty-state h3 {
        margin-bottom: 8px;
        color: #111827;
      }

      .empty-state p {
        color: #6b7280;
        line-height: 1.5;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
}
