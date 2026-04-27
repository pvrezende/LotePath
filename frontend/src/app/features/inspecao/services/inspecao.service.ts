import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateInspecaoRequest,
  Inspecao,
} from '../models/inspecao.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InspecaoService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createInspecao(
    loteId: string,
    data: CreateInspecaoRequest
  ): Observable<{ inspecao: Inspecao }> {
    return this.http.post<{ inspecao: Inspecao }>(
      `${this.apiUrl}/lotes/${loteId}/inspecao`,
      data
    );
  }
}
