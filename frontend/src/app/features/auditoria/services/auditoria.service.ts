import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuditLog } from '../models/audit-log.model';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getLogs(modulo?: string): Observable<{ status: number; data: AuditLog[] }> {
    return this.http
      .get<{ status: number; data: AuditLog[] }>(`${this.apiUrl}/auditoria`)
      .pipe(
        map((response) => {
          if (!modulo) {
            return response;
          }

          return {
            ...response,
            data: response.data.filter((log) => log.modulo === modulo),
          };
        })
      );
  }
}
