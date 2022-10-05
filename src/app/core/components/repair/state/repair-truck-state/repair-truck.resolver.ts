import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RepairListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RepairTService } from '../repair.service';
import { RepairTruckState, RepairTruckStore } from './repair-truck.store';

@Injectable({
  providedIn: 'root',
})
export class RepairTruckResolver implements Resolve<RepairTruckState> {
  constructor(
    private repairService: RepairTService,
    private repairTruckStore: RepairTruckStore
  ) {}

  resolve(): Observable<RepairTruckState | boolean> {
    return this.repairService
      .getRepairList(undefined, 1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 25)
      .pipe(
        catchError(() => {
          return of('No repair trucks data...');
        }),
        tap((repairTruckPagination: RepairListResponse) => {

          console.log('RepairTruckResolver');
          console.log(repairTruckPagination);
          
          localStorage.setItem(
            'repairTruckTrailerTableCount',
            JSON.stringify({
              repairTrucks: repairTruckPagination.truckCount,
              repairTrailers: repairTruckPagination.trailerCount,
            })
          );

          this.repairTruckStore.set(repairTruckPagination.pagination.data);
        })
      );
  }
}
