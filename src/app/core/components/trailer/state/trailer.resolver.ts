import { TrailerState, TrailerStore } from './trailer.store';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrailerTService } from './trailer.service';
import { TrailerQuery } from './trailer.query';
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
  ) {
    console.log('Ucitava se constructor za trailer resolver')
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TrailerState | boolean> {
    console.log('Ucitava se resolve za trailer resolver')
    return this.trailerService.getTrailers(this.tableTab, this.pageIndex, this.pageSize).pipe(
      catchError(() => {
        return of('No trailer data...');
      }),
      tap((trailerPagination: TrailerListResponse) => {
        this.trailerStore.set(trailerPagination.pagination.data);
      })
    );

   /*  if (this.trailerStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.trailerService.getTrailers(1, 1, 25).pipe(
        catchError(() => {
          return of('No trailer data...');
        }),
        tap((trailerPagination: TrailerListResponse) => {
          this.trailerStore.set(trailerPagination.pagination.data);
        })
      );
    } */
  }
}
