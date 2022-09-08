import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoadListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadTService } from '../load.service';
import { LoadActiveState, LoadActiveStore } from './load-active.store';

@Injectable({
  providedIn: 'root',
})
export class LoadActiveResolver implements Resolve<LoadActiveState> {
  constructor(
    private loadService: LoadTService,
    private loadActiveStore: LoadActiveStore
  ) {}

  resolve(): Observable<LoadActiveState | boolean> {
    console.log('Poziva se LoadActiveResolver')

    return this.loadService
      .getLoadList(
        undefined,
        2,
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
          return of('No load active data...');
        }),
        tap((loadPagination: LoadListResponse) => {
          localStorage.setItem(
            'loadTableCount',
            JSON.stringify({
              pendingCount: loadPagination.pendingCount,
              activeCount: loadPagination.activeCount,
              closedCount: loadPagination.closedCount,
              templateCount: /* loadPagination.templateCount */ 0,
            })
          );

          this.loadActiveStore.set(loadPagination.pagination.data);
        })
      );
  }
}
