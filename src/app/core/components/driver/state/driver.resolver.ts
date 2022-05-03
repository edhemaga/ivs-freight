import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriversQuery } from './driver.query';
import { DriverService } from './driver.service';
import { DriversState, DriversStore } from './driver.store';

@Injectable({
  providedIn: 'root',
})
export class DriverResolver implements Resolve<DriversState> {
  constructor(
    private driverService: DriverService,
    private driversStore: DriversStore,
    private driversQuery: DriversQuery
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<DriversState> | Observable<any> {
    console.log('RESOLVER DRIVER');

    return this.driverService.getDrivers().pipe(
      catchError((error) => {
        return of('No drivers data...');
      }),
      tap((entities) => this.driversStore.set({ entities: entities }))
    );

    // return this.driverService.getDrivers();
  }
}
