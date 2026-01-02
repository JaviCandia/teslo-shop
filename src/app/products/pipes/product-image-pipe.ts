import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {

   // 1. Normalización: Si es array, toma el primero. Si no, toma el valor entero.
    const image = Array.isArray(value) ? value[0] : value;

    // 2. Validación única: Si 'image' no existe (es null, undefined o string vacío)
    if ( !image ) {
        return './assets/images/no-image.jpg';
    }

    // 3. Retorno
    return `${ baseUrl }/files/product/${ image }`;
  }
}
