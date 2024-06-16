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
import { DriverQuery } from '@pages/driver/state/driver-state/driver.query';
import { DriversInactiveQuery } from '@pages/driver/state/driver-inactive-state/driver-inactive.query';

// models
import {
    GetTestModalResponse,
    TestResponse,
    TestService,
} from 'appcoretruckassist';

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
        private dlStore: DriversDetailsListStore,
        private driverItemStore: DriversItemStore,
        private driverInactiveStore: DriversInactiveStore,
        private driverInactiveQuery: DriversInactiveQuery,
        private driverActiveQuery: DriverQuery
    ) {}

    public addTest(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.drugService.apiTestPost().pipe(
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
                                this.driverStore.remove(
                                    ({ id }) => id === data.driverId
                                );

                                this.driverStore.add(driver);
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

    public updateTest(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.drugService.apiTestPut().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                this.drugService.apiTestIdGet(res.id).subscribe({
                    next: (resp: any) => {
                        newData.tests.map((reg: any, index: any) => {
                            if (reg.id == resp.id) {
                                newData.tests[index] = resp;
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

    public deleteTestById(id: number): Observable<any> {
        return this.drugService.apiTestIdDelete(id).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let indexNum;
                newData.tests.map((reg: any, index: any) => {
                    if (reg.id == id) {
                        indexNum = index;
                    }
                });

                newData.tests.splice(indexNum, 1);

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

    public getTestById(id: number): Observable<TestResponse> {
        return this.drugService.apiTestIdGet(id);
    }

    public getTestDropdowns(): Observable<GetTestModalResponse> {
        return this.drugService.apiTestModalGet();
    }
}
