import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateInspecaoRequest, Inspecao } from '../models/inspecao.model';
import { environment } from '../../../../environments/environment';
import { Lote } from '../../lotes/models/lote.model';

@Injectable({
  providedIn: 'root',
})
export class InspecaoService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createInspecao(
    loteId: string,
    data: CreateInspecaoRequest & { inspetorId: string }
  ): Observable<{ lote: Lote }> {
    return this.http.post<{ lote: Lote }>(
      `${this.apiUrl}/lotes/${loteId}/inspecao`,
      data
    );
  }

  deleteInspecao(loteId: string): Observable<{ message: string; lote: Lote }> {
    return this.http.delete<{ message: string; lote: Lote }>(
      `${this.apiUrl}/lotes/${loteId}/inspecao`
    );
  }
}
