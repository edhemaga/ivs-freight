import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { DriverResponse } from '../../../../../../../appcoretruckassist';
import { Observable, of, forkJoin } from 'rxjs';
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


        const driverData$ = this.driverService.getDriverById(
            drid,
        );

        const driverCdl$ = this.driverService.getDriverCdlsById(
            drid,
        );

        const driverTest$ = this.driverService.getDriverTestById(
            drid,
        );

        const driverMedical$ = this.driverService.getDriverMedicalsById(
            drid,
        );

        const driverMvr$ = this.driverService.getDriverMvrsById(
            drid,
        );

        
        return forkJoin({
            driverData: driverData$,
            driverCdl: driverCdl$,
            driverTest: driverTest$,
            driverMedical: driverMedical$,
            driverMvr: driverMvr$,
        }).pipe(
            tap((data) => {
                
                let driverData = data.driverData;
                driverData.cdls = data.driverCdl;
                driverData.tests = data.driverTest;
                driverData.medicals = data.driverMedical;
                driverData.mvrs = data.driverMvr;

                this.driverDetailsListStore.add(driverData);
                this.driverItemStore.set([driverData]);
                
            })
        );     


        /*
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
        */
        
    }
}
