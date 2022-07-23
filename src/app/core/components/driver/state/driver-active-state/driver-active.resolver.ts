import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DriverListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import { DriversActiveState, DriversActiveStore } from './driver-active.store';

@Injectable({
  providedIn: 'root',
})
export class DriverActiveResolver implements Resolve<DriversActiveState> {
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private driverService: DriverTService,
    private driversStore: DriversActiveStore
  ) {}
  resolve(): Observable<DriversActiveState | boolean> {
    return of(true);
    
    if (this.driversStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.driverService
        .getDrivers(1, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No drivers data...');
          }),
          tap((driverPagination: DriverListResponse) => {
            localStorage.setItem(
              'driverTableCount',
              JSON.stringify({
                active: driverPagination.activeCount,
                inactive: driverPagination.inactiveCount,
              })
            );

            this.driversStore.set(driverPagination.pagination.data);
          })
        );
    }
  }
}
