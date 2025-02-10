import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { DriverStore } from '@pages/driver/state/driver-state/driver.store';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details-item.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';

// models
import {
    CreateWithUploadsResponse,
    MedicalResponse,
    MedicalService,
} from 'appcoretruckassist';

// enums
import { EGeneralActions } from '@shared/enums';

@Injectable({
    providedIn: 'root',
})
export class DriverMedicalService {
    constructor(
        // services
        private medicalService: MedicalService,
        private driverService: DriverService,
        private tableService: TruckassistTableService,
        private formDataService: FormDataService,

        // sstore
        private driverStore: DriverStore,
        private driverInactiveStore: DriversInactiveStore,
        private driverDetailsListStore: DriversDetailsListStore,
        private driverItemStore: DriversItemStore
    ) {}

    public addMedical(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.medicalService.apiMedicalPost().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public updateMedical(data: any): Observable<CreateWithUploadsResponse> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.medicalService.apiMedicalPut().pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public deleteMedicalById(data: {
        id: number;
        driverId: number;
        driverStatus: number;
    }): Observable<any> {
        return this.medicalService.apiMedicalIdDelete(data?.id).pipe(
            tap(() => {
                this.setStoreData(data.driverId, data?.driverStatus);
            })
        );
    }

    public getMedicalById(id: number): Observable<MedicalResponse> {
        return this.medicalService.apiMedicalIdGet(id);
    }

    private setStoreData(driverId: number, driverStatus: number): void {
        this.driverService
            .getDriverMedicalsById(driverId)
            .pipe(
                tap((medicals) => {
                    const storeData = this.driverItemStore.getValue();
                    const driverData = JSON.parse(
                        JSON.stringify(storeData.entities)
                    );
                    const driver = driverData[driverId];

                    const mappedDriver = {
                        ...driver,
                        name: driver.firstName + ' ' + driver.lastName,
                        medicals,
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
