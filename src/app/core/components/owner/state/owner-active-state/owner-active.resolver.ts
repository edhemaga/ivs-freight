import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetOwnerListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OwnerTService } from '../owner.service';
import { OwnerActiveState, OwnerActiveStore } from './owner-active.store';

@Injectable({
  providedIn: 'root',
})
export class OwnerActiveResolver implements Resolve<OwnerActiveState> {
  constructor(
    private ownerService: OwnerTService,
    private ownerStore: OwnerActiveStore
  ) {}
  resolve(): Observable<OwnerActiveState | boolean> {
    return this.ownerService.getOwner(1, undefined, undefined, undefined, undefined, undefined, undefined, 1, 25).pipe(
      catchError(() => {
        return of('No owner data...');
      }),
      tap((ownerPagination: GetOwnerListResponse) => {
        localStorage.setItem(
          'ownerTableCount',
          JSON.stringify({
            active: ownerPagination.activeCount,
            inactive: ownerPagination.inactiveCount,
          })
        );

        this.ownerStore.set(ownerPagination.pagination.data);
      })
    );
  }
}
