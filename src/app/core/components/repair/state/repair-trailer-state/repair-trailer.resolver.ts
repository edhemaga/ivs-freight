import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RepairListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RepairTService } from '../repair.service';
import { RepairTrailerState, RepairTrailerStore } from './repair-trailer.store';

@Injectable({
  providedIn: 'root',
})
export class RepairTrailerResolver implements Resolve<RepairTrailerState> {
  constructor(
    private repairService: RepairTService,
    private repairTrailerStore: RepairTrailerStore
  ) {}

  resolve(): Observable<RepairTrailerState | boolean> {
    return this.repairService
      .getRepairList(undefined, 2, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 25)
      .pipe(
        catchError(() => {
          return of('No repair trailers data...');
        }),
        tap((repairTrailerPagination: RepairListResponse) => {
          localStorage.setItem(
            'repairTruckTrailerTableCount',
            JSON.stringify({
              repairTrucks: repairTrailerPagination.truckCount,
              repairTrailers: repairTrailerPagination.trailerCount,
            })
          );
          
          this.repairTrailerStore.set(repairTrailerPagination.pagination.data);
        })
      );
  }
}
