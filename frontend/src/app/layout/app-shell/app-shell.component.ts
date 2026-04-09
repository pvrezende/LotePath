import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="padding: 24px;">
      <h1>LotePath</h1>
      <p>Shell da aplicação carregado.</p>
      <router-outlet />
    </div>
  `,
})
export class AppShellComponent {}
