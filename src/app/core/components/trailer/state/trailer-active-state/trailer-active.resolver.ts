import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TrailerListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrailerTService } from '../trailer.service';
import { TrailerActiveState, TrailerActiveStore } from './trailer-active.store';

@Injectable({
  providedIn: 'root',
})
export class TrailerActiveResolver implements Resolve<TrailerActiveState> {
  constructor(
    private trailerService: TrailerTService,
    private trailerStore: TrailerActiveStore
  ) {}
  resolve(): Observable<TrailerActiveState | boolean> {
    return this.trailerService.getTrailers(1, 1, 25).pipe(
      catchError(() => {
        return of('No active trailer...');
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
