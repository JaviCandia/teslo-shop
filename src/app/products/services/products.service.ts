import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    return this.http
      .get<ProductsResponse>(`${environment.baseUrl}/products`, {
        params: {
            limit,
            offset,
            gender
        }
      })
      .pipe(tap(console.log));
  }
}

// TODO: cambiar el nombre de la implementación y del archivo a functional o nuevo standard