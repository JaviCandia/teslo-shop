import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  pages = input(0);
  currentPage = input<number>(1);

  // Arquitectura: estamos convirtiendo activePage en una signal que podamos ocupar.
  // El motivo de esto es que no podemos hacer operaciones como "set()" directo en un input.
  // Además, cada vez que se modifique en el padre la currentPage, esta señal estará siempre enlazada (linked)
  activePage = linkedSignal(this.currentPage);

  getPageList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
