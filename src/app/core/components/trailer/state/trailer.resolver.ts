import { TrailerState, TrailerStore } from './trailer.store';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrailerTService } from './trailer.service';
import { TrailerListResponse } from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class TrailerResolver implements Resolve<TrailerState> {
  tableTab: number = 1;
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private trailerService: TrailerTService,
    private trailerStore: TrailerStore
  ) {}

  resolve(): Observable<TrailerState | boolean> {
    if (this.trailerStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.trailerService
        .getTrailers(this.tableTab, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No trailer data...');
          }),
          tap((trailerPagination: TrailerListResponse) => {
            this.trailerStore.set(trailerPagination.pagination.data);
          })
        );
    }
  }
}
