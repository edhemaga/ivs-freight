import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DriverResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { DriverTService } from './driver.service';
import { DriversItemStore } from './driver-details.store';

@Injectable({
  providedIn: 'root',
})
export class DriverItemResolver implements Resolve<DriverResponse[]> {
  constructor(private driverService: DriverTService,  private driverItemStore: DriversItemStore) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DriverResponse[]> | Observable<any> {
    const driver_id = route.paramMap.get('id');
    let id = parseInt(driver_id)

    return this.driverService.getDriverById(id).pipe(
      catchError((error) => {
        return of('No drivers data for...' + driver_id);
      }),
      tap((driverResponse: DriverResponse) => {
        console.log(driverResponse);
        this.driverItemStore.add(driverResponse);
      })
       
      // take(1)
    );
  }
}
