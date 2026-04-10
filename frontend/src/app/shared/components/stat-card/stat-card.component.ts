import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <article class="card">
      <div class="card-header">
        <p class="label">{{ label }}</p>
      </div>
      <h3 class="value">{{ value }}</h3>
    </article>
  `,
  styles: [
    `
      .card {
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 18px;
        padding: 22px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        border: 1px solid #e5e7eb;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .label {
        color: #64748b;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.4;
      }

      .value {
        font-size: 34px;
        font-weight: 800;
        color: #0f172a;
        line-height: 1;
      }
    `,
  ],
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
}
