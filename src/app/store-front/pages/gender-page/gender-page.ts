import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCard } from '@products/components/product-card/product-card';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, TitleCasePipe],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  gender = toSignal(this.activatedRoute.params.pipe(map(({ gender }) => gender)));

  productsResource = rxResource({
    params: () => ({ gender: this.gender() }),
    stream: ({ params }) => {
      return this.productService.getProducts({ gender: params.gender });
    },
  });
}
