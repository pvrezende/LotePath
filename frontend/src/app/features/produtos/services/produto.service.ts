import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateProdutoRequest,
  Produto,
  UpdateProdutoRequest,
} from '../models/produto.model';
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

  updateProduto(
    id: string,
    data: UpdateProdutoRequest
  ): Observable<{ produto: Produto }> {
    return this.http.put<{ produto: Produto }>(
      `${this.apiUrl}/produtos/${id}`,
      data
    );
  }

  deleteProduto(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/produtos/${id}`
    );
  }
}
