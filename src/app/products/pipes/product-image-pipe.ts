import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  // Arquitectura: podemos usar esto como template standar para manejo de imagenes mediante pipe
  transform(value: string | string[]): string {
    // Normalización: Si es array, toma el primer elemento. Si no, toma el valor entero.
    const image = Array.isArray(value) ? value[0] : value;

    if (!image) {
      return '/images/no-image.jpg';
    }

    if (image.startsWith('http') || image.startsWith('blob:')) {
      return image;
    }

    // Retorno default (imagen del backend)
    return `${baseUrl}/files/product/${image}`;
  }
}
