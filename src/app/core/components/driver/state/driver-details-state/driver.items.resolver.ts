import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DriverResponse } from '../../../../../../../appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import { DriversItemStore } from './driver-details.store';
import { DriversActiveQuery } from '../driver-active-state/driver-active.query';
import { DriversDetailsQuery } from './driver-details.query';

@Injectable({
  providedIn: 'root',
})
export class DriverItemResolver implements Resolve<DriverResponse[]> {
  constructor(
    private driverService: DriverTService,
    private driverItemStore: DriversItemStore,
    private driverItemQuery: DriversDetailsQuery
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<DriverResponse[]> | Observable<any> {
    const driver_id = route.paramMap.get('id');
    let id = parseInt(driver_id);
      return this.driverService.getDriverById(id).pipe(
        catchError((error) => {
          return of('No drivers data for...' + driver_id);
        }),
        tap((driverResponse: DriverResponse) => {
          this.driverItemStore.set([driverResponse]);
        })
      );
    }
}
