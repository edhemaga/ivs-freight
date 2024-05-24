import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { DriversActiveStore } from '@pages/driver/state/driver-active-state/driver-active.store';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';
import { DriversActiveQuery } from '@pages/driver/state/driver-active-state/driver-active.query';
import { DriversInactiveQuery } from '@pages/driver/state/driver-inactive-state/driver-inactive.query';

// models
import { MedicalResponse, MedicalService } from 'appcoretruckassist';

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
        private driverActiveQuery: DriversActiveQuery,
        private driverInactiveQuery: DriversInactiveQuery,
        private driverInactiveStore: DriversInactiveStore,
        private driverActiveStore: DriversActiveStore,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore
    ) {}

    public addMedical(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.medicalService.apiMedicalPost().pipe(
            tap(() => {
                if (data?.driverId) {
                    this.driverService.getDriverById(data.driverId).subscribe({
                        next: (driver: any) => {
                            let driverInStore = null;

                            // Get Driver From Store
                            if (data.tableActiveTab === 'active') {
                                driverInStore =
                                    this.driverActiveQuery.getEntity(
                                        data.driverId
                                    );
                            } else if (data.tableActiveTab === 'inactive') {
                                driverInStore =
                                    this.driverInactiveQuery.getEntity(
                                        data.driverId
                                    );
                            }

                            // Update Driver Data
                            driver = {
                                ...driver,
                                name: driver.firstName + ' ' + driver.lastName,
                                cdlNumber: driverInStore?.cdlNumber
                                    ? driverInStore.cdlNumber
                                    : null,
                                fileCount: driver?.filesCountForList
                                    ? driver.filesCountForList
                                    : 0,
                            };

                            // Update Driver Store
                            if (data.tableActiveTab === 'active') {
                                this.driverActiveStore.remove(
                                    ({ id }) => id === data.driverId
                                );

                                this.driverActiveStore.add(driver);
                            } else if (data.tableActiveTab === 'inactive') {
                                this.driverInactiveStore.remove(
                                    ({ id }) => id === data.driverId
                                );

                                this.driverInactiveStore.add(driver);
                            }

                            // Send Update Data To Table
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: driver,
                                id: driver.id,
                            });
                        },
                    });
                }
            })
        );
    }

    public deleteMedicalById(id: number): Observable<any> {
        return this.medicalService.apiMedicalIdDelete(id).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let indexNum;
                newData.medicals.map((reg: any, index: any) => {
                    if (reg.id == id) {
                        indexNum = index;
                    }
                });

                newData.medicals.splice(indexNum, 1);

                this.tableService.sendActionAnimation({
                    animation: 'update',
                    data: newData,
                    id: newData.id,
                });

                this.dlStore.add(newData);
                this.driverItemStore.set([newData]);
            })
        );
    }

    public getMedicalById(id: number): Observable<MedicalResponse> {
        return this.medicalService.apiMedicalIdGet(id);
    }

    public updateMedical(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.medicalService.apiMedicalPut().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                this.medicalService.apiMedicalIdGet(res.id).subscribe({
                    next: (resp: any) => {
                        newData.medicals.map((reg: any, index: any) => {
                            if (reg.id == resp.id) {
                                newData.medicals[index] = resp;
                            }
                        });

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });

                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);
                    },
                });
            })
        );
    }
}
