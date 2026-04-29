import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AddInsumoLoteRequest,
  InsumoLote,
} from '../models/insumo-lote.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsumoLoteService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  addInsumoToLote(
    loteId: string,
    data: AddInsumoLoteRequest
  ): Observable<{ insumo: InsumoLote }> {
    return this.http.post<{ insumo: InsumoLote }>(
      `${this.apiUrl}/lotes/${loteId}/insumos`,
      data
    );
  }

  removeInsumoFromLote(
    loteId: string,
    insumoId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/lotes/${loteId}/insumos/${insumoId}`
    );
  }
}
