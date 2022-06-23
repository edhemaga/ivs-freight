import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DriverListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import { DriversState, DriversActiveStore } from './driver-active.store';

@Injectable({
  providedIn: 'root',
})
export class DriverActiveResolver implements Resolve<DriversState> {
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private driverService: DriverTService,
    private driversStore: DriversActiveStore
  ) {}
  resolve(): Observable<DriversState | boolean> {
    return this.driverService
      .getDrivers(1, this.pageIndex, this.pageSize)
      .pipe(
        catchError(() => {
          return of('No drivers data...');
        }),
        tap((driverPagination: DriverListResponse) => {
          localStorage.setItem('driverTableCount', JSON.stringify({
            active: driverPagination.activeCount,
            inactive: driverPagination.inactiveCount
          }));

          this.driversStore.set(driverPagination.pagination.data);
        })
      );

    /* if (this.driversStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.driverService
        .getDrivers(this.tableTab, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No drivers data...');
          }),
          tap((driverPagination: DriverListResponse) => {
            localStorage.setItem('driverTableCount', JSON.stringify({
              active: driverPagination.activeCount,
              inactive: driverPagination.inactiveCount
            }));

            this.driversStore.set(driverPagination.pagination.data);
          })
        );
    } */
  }
}
