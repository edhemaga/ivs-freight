import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DriverListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverTService } from './driver.service';
import { DriversState, DriversStore } from './driver.store';

@Injectable({
  providedIn: 'root',
})
export class DriverResolver implements Resolve<DriversState> {
  tableTab: number = 1;
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private driverService: DriverTService,
    private driversStore: DriversStore
  ) {}
  resolve(): Observable<DriversState | boolean> {
    if (this.driversStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.driverService
        .getDrivers(this.tableTab, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No drivers data...');
          }),
          tap((driverPagination: DriverListResponse) => {
            this.driversStore.set(driverPagination.pagination.data);
          })
        );
    }
  }
}
