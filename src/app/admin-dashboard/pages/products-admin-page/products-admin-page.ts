import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductTable } from '@products/components/product-table/product-table';
import { ProductsService } from '@products/services/products.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
  styles: ``,
})
export class ProductsAdminPage {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        // Arquitectura: el offset siempre debería ser el page * el límite (de productos por página)
        // Esto nos mostraría la cantidad correcta de productos a partir de un offset correcto
        offset: params.page * params.limit,
        limit: params.limit,
      });
    },
  });


  // Arquitectura: es un standar resetear a la página 1 cada vez que actualizamos.
  // Esto evita quedarnos en una página con datos erroneos
  onProductsPerPageChange(value: number) {
    // 1. Actualizamos el signal local para que el rxResource reaccione al limit
    this.productsPerPage.set(value);

    // 2. Forzamos la navegación a la página 1
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        page: 1 // Siempre resetear a 1
      }, 
      queryParamsHandling: 'merge' // ¡OBLIGATORIO para no borrar filtros/búsquedas!
    });
  }
}
