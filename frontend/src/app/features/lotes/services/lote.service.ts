import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateLoteRequest, Lote } from '../models/lote.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoteService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getLotes(): Observable<{ status: number; data: Lote[] }> {
    return this.http.get<{ status: number; data: Lote[] }>(
      `${this.apiUrl}/lotes`
    );
  }

  createLote(data: CreateLoteRequest): Observable<{ lote: Lote }> {
    return this.http.post<{ lote: Lote }>(`${this.apiUrl}/lotes`, data);
  }

  updateLote(
    id: string,
    data: Omit<CreateLoteRequest, 'operadorId'>
  ): Observable<{ lote: Lote }> {
    return this.http.put<{ lote: Lote }>(`${this.apiUrl}/lotes/${id}`, data);
  }

  deleteLote(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/lotes/${id}`);
  }
}
