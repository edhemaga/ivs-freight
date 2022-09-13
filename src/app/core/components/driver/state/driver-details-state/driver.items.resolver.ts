import { DriversMinimalListStore } from './../driver-details-minimal-list-state/driver-minimal-list.store';
import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { DriverResponse } from '../../../../../../../appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import { DriversItemStore } from './driver-details.store';
import { DriversDetailsQuery } from './driver-details.query';
import { DriversMinimalListQuery } from '../driver-details-minimal-list-state/driver-minimal-list.query';

@Injectable({
  providedIn: 'root',
})
export class DriverItemResolver implements Resolve<DriverResponse[]> {
  pageIndex: number = 1;
  pageSize: number = 25;
  constructor(
    private driverService: DriverTService,
    private driverItemStore: DriversItemStore,
    private driverItemQuery: DriversDetailsQuery,
    private driverMiniamL: DriversMinimalListQuery,
    private driverMiniamLS: DriversMinimalListStore,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const driver_id = route.paramMap.get('id');
    let id = parseInt(driver_id);
    console.log(+driver_id);

    if (this.driverMiniamL.hasEntity(id)) {
      let entityDriver;
      this.driverItemQuery.selectAll().subscribe({
        next: (res: DriverResponse[]) => {
          entityDriver = res;
        },
      });
      console.log('store');
      console.log(entityDriver);

      return entityDriver;
    } else {
      return this.driverService.getDriverById(id).pipe(
        catchError((error) => {
          this.router.navigate(['/driver']);
          return of('No drivers data for...' + driver_id);
        }),
        tap((driverResponse: DriverResponse) => {
          console.log('pozvan service');
          this.driverItemStore.set([driverResponse]);
        })
      );
    }
  }
}
