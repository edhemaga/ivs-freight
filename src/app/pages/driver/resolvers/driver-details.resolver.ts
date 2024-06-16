import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, forkJoin, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';

// store
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details-item.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';

@Injectable({
    providedIn: 'root',
})
export class DriverDetailsResolver implements Resolve<any[]> {
    constructor(
        private driverService: DriverService,

        // store
        private driverItemStore: DriversItemStore,
        private driverDetailsListStore: DriversDetailsListStore
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const driverId = parseInt(route.paramMap.get('id'));

        const driverData$ = this.driverService.getDriverById(driverId);

        const driverCdl$ = this.driverService.getDriverCdlsById(driverId);

        const driverTest$ = this.driverService.getDriverTestById(driverId);

        const driverMedical$ =
            this.driverService.getDriverMedicalsById(driverId);

        const driverMvr$ = this.driverService.getDriverMvrsByDriverId(driverId);

        return forkJoin({
            driverData: driverData$,
            driverCdl: driverCdl$,
            driverTest: driverTest$,
            driverMedical: driverMedical$,
            driverMvr: driverMvr$,
        }).pipe(
            tap((data) => {
                const driverData = data?.driverData;

                driverData.cdls = data?.driverCdl;
                driverData.tests = data?.driverTest;
                driverData.medicals = data?.driverMedical;
                driverData.mvrs = data?.driverMvr;

                this.driverDetailsListStore.add(driverData);
                this.driverItemStore.set([driverData]);
            })
        );
    }
}
