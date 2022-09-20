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
  constructor(
    private driverService: DriverTService,
    private driversStore: DriversInactiveStore
  ) {}
  resolve(): Observable<DriversInactiveState | boolean> {
    console.log('Poziva se DriverActiveResolver ')

    return this.driverService.getDrivers(0, undefined, undefined, undefined, 1, 25).pipe(
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
