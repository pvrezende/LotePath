import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProdutoRequest, Produto } from '../models/produto.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProdutos(): Observable<{ status: number; data: Produto[] }> {
    return this.http.get<{ status: number; data: Produto[] }>(
      `${this.apiUrl}/produtos`
    );
  }

  createProduto(data: CreateProdutoRequest): Observable<{ produto: Produto }> {
    return this.http.post<{ produto: Produto }>(`${this.apiUrl}/produtos`, data);
  }
}
