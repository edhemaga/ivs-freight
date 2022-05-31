import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DriverShortResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { DriverTService } from './driver.service';

@Injectable({
  providedIn: 'root',
})
export class DriverItemResolver implements Resolve<DriverShortResponse> {
  constructor(private driverService: DriverTService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DriverShortResponse> | Observable<any> {
    const driver_id = route.paramMap.get('id');
    return this.driverService.getDriverById(+driver_id).pipe(
      catchError((error) => {
        return of('No drivers data for...' + driver_id);
      }),
      take(1)
    );
  }
}
