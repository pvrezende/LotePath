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
    data?: string
  ): Observable<{
    dataReferencia: string;
    indicadores: DashboardIndicadores;
    ultimosLotes: DashboardLote[];
  }> {
    const query = data ? `?data=${encodeURIComponent(data)}` : '';

    return this.http.get<{
      dataReferencia: string;
      indicadores: DashboardIndicadores;
      ultimosLotes: DashboardLote[];
    }>(`${this.apiUrl}/dashboard${query}`);
  }
}
