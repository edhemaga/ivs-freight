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
    console.log('Poziva se RepairTruckResolver')
    return this.repairService
      .getRepairList(undefined, undefined, 1, undefined, undefined, undefined, 1, 25)
      .pipe(
        catchError(() => {
          return of('No repair trucks data...');
        }),
        tap((repairTruckPagination: RepairListResponse) => {
          localStorage.setItem(
            'repairTruckTrailerTableCount',
            JSON.stringify({
              repairTrucks: /* driverPagination.truckCount */ 0,
              repairTrailers: /* driverPagination.trailerCount */ 0,
            })
          );

          this.repairTruckStore.set(repairTruckPagination.pagination.data);
        })
      );
  }
}
