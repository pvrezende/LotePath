import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuditLogResponse } from '../models/audit-log.model';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getLogs(modulo?: 'insumos' | 'inspecao'): Observable<AuditLogResponse> {
    const query = modulo ? `?modulo=${encodeURIComponent(modulo)}` : '';

    return this.http.get<AuditLogResponse>(`${this.apiUrl}/auditoria${query}`);
  }
}
