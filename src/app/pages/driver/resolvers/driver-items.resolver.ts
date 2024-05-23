import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, forkJoin, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/pages/driver-modals/driver-modal/services/driver.service';

// store
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class DriverItemsResolver implements Resolve<any[]> {
    pageIndex: number = 1;
    pageSize: number = 25;
    constructor(
        private driverService: DriverService,
        private driverItemStore: DriversItemStore,
        private driverDetailsListStore: DriversDetailsListStore
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const driver_id = route.paramMap.get('id');
        let drid = parseInt(driver_id);

        const driverData$ = this.driverService.getDriverById(drid);

        const driverCdl$ = this.driverService.getDriverCdlsById(drid);

        const driverTest$ = this.driverService.getDriverTestById(drid);

        const driverMedical$ = this.driverService.getDriverMedicalsById(drid);

        const driverMvr$ = this.driverService.getDriverMvrsByDriverId(drid);

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
                tap((driverResponse: any) => {
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
                tap((driverResponse: any) => {
                    this.driverDetailsListStore.add(driverResponse);
                    this.driverItemStore.set([driverResponse]);
                })
            );
        }
        */
    }
}
