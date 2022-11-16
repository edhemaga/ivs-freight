import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { DriverResponse } from '../../../../../../../appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import { DriversItemStore } from './driver-details.store';
import { DriversDetailsListStore } from '../driver-details-list-state/driver-details-list.store';
import { DriversDetailsListQuery } from '../driver-details-list-state/driver-details-list.query';

@Injectable({
   providedIn: 'root',
})
export class DriverItemResolver implements Resolve<DriverResponse[]> {
   pageIndex: number = 1;
   pageSize: number = 25;
   constructor(
      private driverService: DriverTService,
      private driverItemStore: DriversItemStore,
      private driverDetailsListQuery: DriversDetailsListQuery,
      private driverDetailsListStore: DriversDetailsListStore,
      private router: Router
   ) {}
   resolve(route: ActivatedRouteSnapshot): Observable<any> {
      const driver_id = route.paramMap.get('id');
      let drid = parseInt(driver_id);
      if (this.driverDetailsListQuery.hasEntity(drid)) {
         return this.driverDetailsListQuery.selectEntity(drid).pipe(
            tap((driverResponse: DriverResponse) => {
               this.driverItemStore.set([driverResponse]);
            }),
            take(1)
         );
      } else {
         return this.driverService.getDriverById(drid).pipe(
            catchError((error) => {
               this.router.navigate(['/driver']);
               return of('No drivers data for...' + driver_id);
            }),
            tap((driverResponse: DriverResponse) => {
               this.driverDetailsListStore.add(driverResponse);
               this.driverItemStore.set([driverResponse]);
            })
         );
      }
   }
}
