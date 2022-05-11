import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DriverListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriversQuery } from './driver.query';
import { DriverTService } from './driver.service';
import { DriversState, DriversStore } from './driver.store';

@Injectable({
  providedIn: 'root',
})
export class DriverResolver implements Resolve<DriversState> {
  constructor(
    private driverService: DriverTService,
    private driversStore: DriversStore,
    private driversQuery: DriversQuery
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<DriversState> | Observable<any> {
    // if (this.driversStore.getValue().ids.length) {
    //   return of(true);
    // } else {
    //   return this.driverService.getDrivers(1, 1, 25).pipe(
    //     catchError((error) => {
    //       return of('No drivers data...');
    //     }),
    //     tap((driverPagination: DriverListResponse) => {
    //       this.driversStore.set({ entities: driverPagination.pagination.data });
    //     })
    //   );
    // }

    return this.driverService.getDrivers(1, 1, 25).pipe(
      catchError((error) => {
        this.driversStore.set({ entities: [] });
        return of('No drivers data...');
      }),
      tap((driverPagination: DriverListResponse) => {
        console.log('On Resolver');
        console.log(driverPagination);
        this.driversStore.set({ entities: driverPagination.pagination.data });
      })
    );
  }
}
