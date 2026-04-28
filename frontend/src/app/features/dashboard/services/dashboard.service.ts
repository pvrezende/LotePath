import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardIndicadores,
  DashboardLote,
} from '../models/dashboard.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getDashboard(
    dataInicial?: string,
    dataFinal?: string
  ): Observable<{
    periodo: {
      dataInicial: string;
      dataFinal: string;
    };
    indicadores: DashboardIndicadores;
    ultimosLotes: DashboardLote[];
  }> {
    const params = new URLSearchParams();

    if (dataInicial) {
      params.set('dataInicial', dataInicial);
    }

    if (dataFinal) {
      params.set('dataFinal', dataFinal);
    }

    const query = params.toString() ? `?${params.toString()}` : '';

    return this.http.get<{
      periodo: {
        dataInicial: string;
        dataFinal: string;
      };
      indicadores: DashboardIndicadores;
      ultimosLotes: DashboardLote[];
    }>(`${this.apiUrl}/dashboard${query}`);
  }
}
