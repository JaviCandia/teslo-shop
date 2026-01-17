import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

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

  getProductByIdSlug(idSlug: string): Observable<Product> {

    return this.http
      .get<ProductsResponse>(`${environment.baseUrl}/products/${idSlug}`)
      .pipe(
        tap(console.log)
      )
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    // if (this.productCache.has(id)) {
    //   return of(this.productCache.get(id)!);
    // }

    return this.http
      .get<Product>(`${environment.baseUrl}/products/${id}`);
      // .pipe(tap((product) => this.productCache.set(id, product)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${environment.baseUrl}/products/${id}`, productLike)
      // .pipe(tap((product) => this.updateProductCache(product)));
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${environment.baseUrl}/products`, productLike)
      // .pipe(tap((product) => this.updateProductCache(product)));
  }

  // updateProductCache(product: Product) {
  //   const productId = product.id;

  //   this.productCache.set(productId, product);

  //   this.productsCache.forEach((productResponse) => {
  //     productResponse.products = productResponse.products.map(
  //       (currentProduct) =>
  //         currentProduct.id === productId ? product : currentProduct
  //     );
  //   });

  //   console.log('Caché actualizado');
  // }
}

// TODO: cambiar el nombre de la implementación y del archivo a functional o nuevo standard