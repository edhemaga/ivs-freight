import { CreateWithUploadsResponse, MvrService } from 'appcoretruckassist';
import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';
import { DriverStore } from '@pages/driver/state/driver-state/driver.store';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details-item.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';

// models
import { GetMvrModalResponse, MvrResponse } from 'appcoretruckassist';

// enums
import { EGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class DriverMvrService {
    constructor(
        // services
        private mvrService: MvrService,
        private driverService: DriverService,
        private tableService: TruckassistTableService,
        private formDataService: FormDataService,

        // store
        private driverStore: DriverStore,
        private driverInactiveStore: DriversInactiveStore,
        private driverItemStore: DriversItemStore,
        private driverDetailsListStore: DriversDetailsListStore
    ) {}

    public addMvr(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.mvrService.apiMvrPost().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public updateMvr(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.mvrService.apiMvrPut().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public deleteMvrById(data: {
        id: number;
        driverId: number;
        driverStatus: number;
    }): Observable<any> {
        return this.mvrService.apiMvrIdDelete(data?.id).pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public getMvrById(id: number): Observable<MvrResponse> {
        return this.mvrService.apiMvrIdGet(id);
    }

    public getMvrModal(driverId: number): Observable<GetMvrModalResponse> {
        return this.mvrService.apiMvrModalDriverIdGet(driverId);
    }

    private setStoreData(driverId: number, driverStatus: number): void {
        this.driverService
            .getDriverMvrsByDriverId(driverId)
            .pipe(
                tap((mvrs) => {
                    const storeData = this.driverItemStore.getValue();
                    const driverData = JSON.parse(
                        JSON.stringify(storeData.entities)
                    );
                    const driver = driverData[driverId];

                    const mappedDriver = {
                        ...driver,
                        name: driver.firstName + ' ' + driver.lastName,
                        mvrs,
                    };

                    this.driverDetailsListStore.add(mappedDriver);
                    this.driverItemStore.set([mappedDriver]);

                    driverStatus
                        ? this.driverStore.add(mappedDriver)
                        : this.driverInactiveStore.add(driver);

                    this.tableService.sendActionAnimation({
                        animation: EGeneralActions.UPDATE,
                        data: mappedDriver,
                        id: mappedDriver.id,
                    });
                })
            )
            .subscribe();
    }
}
