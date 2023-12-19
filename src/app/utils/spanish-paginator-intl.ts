import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";

@Injectable()
export class SpanishPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = /* $localize */`Ir a la primera página`;
  itemsPerPageLabel = /* $localize */`Elementos por página:`;
  lastPageLabel = /* $localize */`Ir a la última página`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Página siguiente';
  previousPageLabel = 'Página anterior';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}
