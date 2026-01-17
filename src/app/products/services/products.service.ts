import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { concatMap } from 'rxjs/operators'; // ✅ Importante: Usamos concatMap
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
  private readonly baseUrl = environment.baseUrl;

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    return this.http
      .get<ProductsResponse>(`${this.baseUrl}/products`, {
        params: { limit, offset, gender },
      })
      .pipe(tap(console.log));
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    return this.http
      .get<ProductsResponse>(`${this.baseUrl}/products/${idSlug}`)
      .pipe(tap(console.log));
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  // Arquitectura: toda esta parte de subir imagenes lo podrás usar como referencia para futuros proyectos
  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.uploadImages(imageFileList).pipe(
      map(imageNames => this.preparePayload(productLike, imageNames)),
      // Usamos concatMap para asegurar la creación
      concatMap(payload => this.http.post<Product>(`${this.baseUrl}/products`, payload))
    );
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    return this.uploadImages(imageFileList).pipe(
      map(imageNames => this.preparePayload(productLike, imageNames)),
      // concatMap evita que se cancele la petición si el usuario da doble click rápido
      concatMap(payload =>
        this.http.patch<Product>(`${this.baseUrl}/products/${id}`, payload)
      )
    );
  }

  private preparePayload(productLike: Partial<Product>, newImages: string[]): Partial<Product> {
    const currentImages = productLike.images ?? [];
    return {
      ...productLike,
      images: [...currentImages, ...newImages],
    };
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) => this.uploadImage(imageFile));

    return forkJoin(uploadObservables).pipe(tap((imageNames) => console.log({ imageNames })));
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(`${this.baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}