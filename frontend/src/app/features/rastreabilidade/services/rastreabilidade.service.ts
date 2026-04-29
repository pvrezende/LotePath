import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RastreabilidadeInsumoResponse,
  RastreabilidadeLoteResponse,
} from '../models/rastreabilidade.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RastreabilidadeService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getRastreabilidadePorLote(
    loteId: string
  ): Observable<RastreabilidadeLoteResponse> {
    return this.http.get<RastreabilidadeLoteResponse>(
      `${this.apiUrl}/rastreabilidade/lote/${loteId}`
    );
  }

  getRastreabilidadePorInsumo(
    valor: string
  ): Observable<RastreabilidadeInsumoResponse> {
    return this.http.get<RastreabilidadeInsumoResponse>(
      `${this.apiUrl}/rastreabilidade/insumo?valor=${encodeURIComponent(valor)}`
    );
  }
}
