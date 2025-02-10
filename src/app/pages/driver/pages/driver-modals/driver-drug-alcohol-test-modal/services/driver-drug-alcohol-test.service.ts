import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

//Store
import { DriverStore } from '@pages/driver/state/driver-state/driver.store';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details-item.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';

// models
import {
    CreateWithUploadsResponse,
    GetTestModalResponse,
    TestResponse,
    TestService,
} from 'appcoretruckassist';

// enums
import { EGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class DriverDrugAlcoholTestService {
    constructor(
        // services
        private drugService: TestService,
        private driverService: DriverService,
        private tableService: TruckassistTableService,
        private formDataService: FormDataService,

        // store
        private driverStore: DriverStore,
        private driverInactiveStore: DriversInactiveStore,
        private driverDetailsListStore: DriversDetailsListStore,
        private driverItemStore: DriversItemStore
    ) {}

    public addTest(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.drugService.apiTestPost().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public updateTest(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.drugService.apiTestPut().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public deleteTestById(data: {
        id: number;
        driverId: number;
        driverStatus: number;
    }): Observable<any> {
        return this.drugService.apiTestIdDelete(data?.id).pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public getTestById(id: number): Observable<TestResponse> {
        return this.drugService.apiTestIdGet(id);
    }

    public getTestDropdowns(): Observable<GetTestModalResponse> {
        return this.drugService.apiTestModalGet();
    }

    private setStoreData(driverId: number, driverStatus: number): void {
        this.driverService
            .getDriverTestById(driverId)
            .pipe(
                tap((tests) => {
                    const storeData = this.driverItemStore.getValue();
                    const driverData = JSON.parse(
                        JSON.stringify(storeData.entities)
                    );
                    const driver = driverData[driverId];

                    const mappedDriver = {
                        ...driver,
                        name: driver.firstName + ' ' + driver.lastName,
                        tests,
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
