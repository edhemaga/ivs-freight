import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DriverListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import {
  DriversInactiveState,
  DriversInactiveStore,
} from './driver-inactive.store';

@Injectable({
  providedIn: 'root',
})
export class DriverInactiveResolver implements Resolve<DriversInactiveState> {
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private driverService: DriverTService,
    private driversStore: DriversInactiveStore
  ) {}
  resolve(): Observable<DriversInactiveState | boolean> {
    /* return this.driverService
    .getDrivers(0, this.pageIndex, this.pageSize)
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
    ); */

    if (this.driversStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.driverService
        .getDrivers(0, this.pageIndex, this.pageSize)
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
