import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <article class="card">
      <p class="label">{{ label }}</p>
      <h3 class="value">{{ value }}</h3>
    </article>
  `,
  styles: [
    `
      .card {
        background: white;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
        border: 1px solid #e5e7eb;
      }

      .label {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .value {
        font-size: 28px;
        color: #111827;
      }
    `,
  ],
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
}
