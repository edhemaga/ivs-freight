import { MvrService } from 'appcoretruckassist';
import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';
import { DriversInactiveQuery } from '@pages/driver/state/driver-inactive-state/driver-inactive.query';
import { DriversActiveQuery } from '@pages/driver/state/driver-active-state/driver-active.query';
import { DriversActiveStore } from '@pages/driver/state/driver-active-state/driver-active.store';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';

// models
import { GetMvrModalResponse, MvrResponse } from 'appcoretruckassist';

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
        private driverActiveStore: DriversActiveStore,
        private driverActiveQuery: DriversActiveQuery,
        private driverInactiveStore: DriversInactiveStore,
        private driverInactiveQuery: DriversInactiveQuery,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore
    ) {}

    // Add Mvr
    public addMvr(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.mvrService.apiMvrPost().pipe(
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

    public deleteMvrById(id: number): Observable<any> {
        return this.mvrService.apiMvrIdDelete(id).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let indexNum;
                newData.mvrs.map((reg: any, index: any) => {
                    if (reg.id == id) {
                        indexNum = index;
                    }
                });

                newData.mvrs.splice(indexNum, 1);

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

    public getMvrById(id: number): Observable<MvrResponse> {
        return this.mvrService.apiMvrIdGet(id);
    }

    public updateMvr(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.mvrService.apiMvrPut().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                this.mvrService.apiMvrIdGet(res.id).subscribe({
                    next: (resp: any) => {
                        newData.mvrs.map((reg: any, index: any) => {
                            if (reg.id == resp.id) {
                                newData.mvrs[index] = resp;
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

    public getMvrModal(driverId: number): Observable<GetMvrModalResponse> {
        return this.mvrService.apiMvrModalDriverIdGet(driverId);
    }
}
