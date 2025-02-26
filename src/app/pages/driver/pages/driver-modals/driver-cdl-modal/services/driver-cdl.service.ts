import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { DriverStore } from '@pages/driver/state/driver-state/driver.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details-item.store';
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';

// models
import {
    CdlResponse,
    CdlService,
    CreateWithUploadsResponse,
    GetCdlModalResponse,
} from 'appcoretruckassist';

// enums
import { eGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class DriverCdlService {
    constructor(
        // services
        private cdlService: CdlService,
        private driverService: DriverService,
        private tableService: TruckassistTableService,
        private formDataService: FormDataService,

        // store
        private driverStore: DriverStore,
        private driverInactiveStore: DriversInactiveStore,
        private driverItemStore: DriversItemStore,
        private driverDetailsListStore: DriversDetailsListStore
    ) {}

    public addCdl(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.cdlService.apiCdlPost().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public updateCdl(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.cdlService.apiCdlPut().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public deleteCdlById(data: {
        id: number;
        driverId: number;
        driverStatus: number;
    }): Observable<any> {
        return this.cdlService.apiCdlIdDelete(data?.id).pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public activateCdlById(data: {
        id: number;
        driverId: number;
        driverStatus: number;
    }): Observable<any> {
        return this.cdlService.apiCdlActivateIdPut(data?.id).pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public deactivateCdlById(data: {
        id: number;
        driverId: number;
        driverStatus: number;
    }) {
        return this.cdlService.apiCdlDeactivateIdPut(data?.driverId).pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public renewCdlUpdate(data: any): Observable<any> {
        return this.cdlService.apiCdlRenewPost(data).pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public getCdlById(id: number): Observable<CdlResponse> {
        return this.cdlService.apiCdlIdGet(id);
    }

    public getCdlDropdowns(): Observable<GetCdlModalResponse> {
        return this.cdlService.apiCdlModalGet();
    }

    private setStoreData(driverId: number, driverStatus: number): void {
        this.driverService
            .getDriverCdlsById(driverId)
            .pipe(
                tap((cdls) => {
                    const storeData = this.driverItemStore.getValue();
                    const driverData = JSON.parse(
                        JSON.stringify(storeData.entities)
                    );
                    const driver = driverData[driverId];

                    const mappedDriver = {
                        ...driver,
                        name: driver.firstName + ' ' + driver.lastName,
                        cdls,
                    };

                    this.driverDetailsListStore.add(mappedDriver);
                    this.driverItemStore.set([mappedDriver]);

                    driverStatus
                        ? this.driverStore.add(mappedDriver)
                        : this.driverInactiveStore.add(driver);

                    this.tableService.sendActionAnimation({
                        animation: eGeneralActions.UPDATE,
                        data: mappedDriver,
                        id: mappedDriver.id,
                    });
                })
            )
            .subscribe();
    }
}
