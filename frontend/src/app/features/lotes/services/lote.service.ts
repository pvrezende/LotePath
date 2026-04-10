import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateLoteRequest, Lote } from '../models/lote.model';

@Injectable({
  providedIn: 'root',
})
export class LoteService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5336';

  getLotes(): Observable<{ status: number; data: Lote[] }> {
    return this.http.get<{ status: number; data: Lote[] }>(
      `${this.apiUrl}/lotes`
    );
  }

  createLote(data: CreateLoteRequest): Observable<{ lote: Lote }> {
    return this.http.post<{ lote: Lote }>(`${this.apiUrl}/lotes`, data);
  }
}
