import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-shell/app-shell.component').then(
        (m) => m.AppShellComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'produtos',
        loadComponent: () =>
          import('./features/produtos/pages/produtos/produtos.component').then(
            (m) => m.ProdutosComponent
          ),
      },
      {
        path: 'lotes',
        loadComponent: () =>
          import('./features/lotes/pages/lotes/lotes.component').then(
            (m) => m.LotesComponent
          ),
      },
      {
        path: 'insumos',
        loadComponent: () =>
          import('./features/insumos/pages/insumos-lote/insumos-lote.component').then(
            (m) => m.InsumosLoteComponent
          ),
      },
      {
        path: 'inspecao',
        loadComponent: () =>
          import('./features/inspecao/pages/inspecao-lote/inspecao-lote.component').then(
            (m) => m.InspecaoLoteComponent
          ),
      },
      {
        path: 'rastreabilidade',
        loadComponent: () =>
          import(
            './features/rastreabilidade/pages/rastreabilidade/rastreabilidade.component'
          ).then((m) => m.RastreabilidadeComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/pages/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
