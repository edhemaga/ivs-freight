import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadTService } from '../load.service';
import { LoadPandingState, LoadPandinStore } from './load-panding.store';

@Injectable({
  providedIn: 'root',
})
export class LoadPandingResolver implements Resolve<LoadPandingState> {
  constructor(
    private loadService: LoadTService,
    private loadPandingStore: LoadPandinStore
  ) {}

  resolve(): Observable<LoadPandingState | boolean> {
    return this.loadService
      .getLoadList(
        undefined,
        1,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        25,
      )
      .pipe(
        catchError(() => {
          return of('No load panding data...');
        }),
        tap((loadPagination: LoadListResponse) => {
          console.log('Poziva se LoadPandingResolver')
          console.log(loadPagination);

          localStorage.setItem(
            'loadTableCount',
            JSON.stringify({
              pendingCount: loadPagination.pendingCount,
              activeCount: loadPagination.activeCount,
              closedCount: loadPagination.closedCount,
              templateCount: /* loadPagination.templateCount */ 0,
            })
          );

          this.loadPandingStore.set(loadPagination.pagination.data);
        })
      );
  }
}
