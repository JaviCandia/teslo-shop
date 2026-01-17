import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// ✅ CORRECCIÓN 1: Importamos los tipos estrictos
import { Product, Gender, Size } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [ProductCarousel, FormErrorLabel, ReactiveFormsModule],
  templateUrl: './product-details.html',
})
export class ProductDetails {
  // Inputs & Servicios
  product = input.required<Product>();
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);

  // Estado Visual
  wasSaved = signal(false);
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Arquitectura: fusionamos las imagenes del product() con las imagenes del file uploader
  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  carouselImages = computed(() => {
    const currentImages = this.product().images;
    const newImages = this.tempImages();
    
    // Spread operator para fusionar ambos arrays
    return [ ...currentImages, ...newImages ];
  });


  // Formulario NonNullable (Evita conflictos null vs undefined)
  productForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[] as string[]],
    images: [[] as string[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  constructor() {
    // Sincronización reactiva
    effect(() => {
      const prod = this.product();
      this.productForm.reset({
        ...prod,
        tags: prod.tags.join(', '),
      });
    });
  }

  toggleSize(size: string) {
    const currentSizes = new Set(this.productForm.value.sizes || []);
    currentSizes.has(size) ? currentSizes.delete(size) : currentSizes.add(size);
    this.productForm.patchValue({ sizes: Array.from(currentSizes) });
  }

  // Arquitectura: usamos async/await y no rxjs porque es un disparo único.
  // Estamos haciendo 1 única acción que es enviar el formulario
  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const { tags, ...formValues } = this.productForm.getRawValue();

    const payload: Partial<Product> = {
      ...formValues,
      tags: this.parseTags(tags),
      gender: formValues.gender as Gender,
      sizes: formValues.sizes as Size[],
    };

    try {
      if (this.product().id === 'new') {
        // ✅ CORRECCIÓN 3: firstValueFrom para obtener el objeto real y su ID
        const created = await firstValueFrom(this.productsService.createProduct(payload));
        this.router.navigate(['/admin/products', created.id]);
      } else {
        await firstValueFrom(this.productsService.updateProduct(this.product().id, payload, this.imageFileList));
        this.showSuccessFeedback();
      }
    } catch (error) {
      console.error('Error guardando', error);
    }
  }

  private parseTags(tags: string): string[] {
    return tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);
  }

  private showSuccessFeedback() {
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }

  
  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map((file) => URL.createObjectURL(file));

    this.tempImages.set(imageUrls);
  }

  /* * Arquitectura: TIP SENIOR ADICIONAL: Gestión de Memoria
   * Las URLs blob se quedan en memoria del navegador hasta que se cierran.
   * En una app muy grande, deberías limpiarlas al destruir el componente.
   */
  ngOnDestroy() {
    this.tempImages().forEach(url => URL.revokeObjectURL(url));
  }
}
