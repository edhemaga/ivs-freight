import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TrailerListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrailerTService } from '../trailer.service';
import { TrailerInactiveState, TrailerInactiveStore } from './trailer-inactive.store';

@Injectable({
  providedIn: 'root',
})
export class TrailerInactiveResolver implements Resolve<TrailerInactiveState> {
  constructor(
    private trailerService: TrailerTService,
    private trailerStore: TrailerInactiveStore
  ) {}
  resolve(): Observable<TrailerInactiveState | boolean> {
   /*  return of(true); */

    if (this.trailerStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.trailerService
        .getTrailers(0, 1, 25)
        .pipe(
          catchError(() => {
            return of('No inactive trailer...');
          }),
          tap((trailerPagination: TrailerListResponse) => {
            localStorage.setItem(
              'trailerTableCount',
              JSON.stringify({
                active: trailerPagination.activeCount,
                inactive: trailerPagination.inactiveCount,
              })
            );

            this.trailerStore.set(trailerPagination.pagination.data);
          })
        );
    }
  }
}
