import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DriverService } from '@pages/driver/services/driver.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { DriverStore } from '@pages/driver/state/driver-state/driver.store';
import { DriversDetailsListStore } from '@pages/driver/state/driver-details-list-state/driver-details-list.store';
import { DriversItemStore } from '@pages/driver/state/driver-details-state/driver-details.store';
import { DriversInactiveStore } from '@pages/driver/state/driver-inactive-state/driver-inactive.store';

// models
import {
    CdlResponse,
    CdlService,
    GetCdlModalResponse,
    RenewCdlCommand,
} from 'appcoretruckassist';

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
        private dlStore: DriversDetailsListStore
    ) {}

    public addCdl(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);

        return this.cdlService.apiCdlPost().pipe(
            tap(() => {
                if (data?.driverId) {
                    this.driverService.getDriverById(data.driverId).subscribe({
                        next: (driver: any) => {
                            // Update Driver Data
                            driver = {
                                ...driver,
                                name: driver.firstName + ' ' + driver.lastName,
                                cdlNumber: data?.cdlNumber
                                    ? data.cdlNumber
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

    public updateCdl(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        let driverId = data.driverId
            ? data.driverId
            : this.driverItemStore.getValue().ids[0];
        return this.cdlService.apiCdlPut().pipe(
            tap((res: any) => {
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                this.cdlService.apiCdlIdGet(res.id).subscribe({
                    next: (resp: any) => {
                        newData.cdls.map((reg: any, index: any) => {
                            if (reg.id == resp.id) {
                                newData.cdls[index] = resp;
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

    public deleteCdlById(id: number): Observable<any> {
        return this.cdlService.apiCdlIdDelete(id).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let indexNum;
                newData.cdls.map((reg: any, index: any) => {
                    if (reg.id == id) {
                        indexNum = index;
                    }
                });

                newData.cdls.splice(indexNum, 1);

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

    public activateCdlById(id: number): Observable<any> {
        return this.cdlService.apiCdlActivateIdPut(id).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                this.cdlService.apiCdlListGet(driverId).subscribe({
                    next: (resp: any) => {
                        newData.cdls = resp;

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });

                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);
                    },
                });

                this.cdlService.apiCdlIdGet(id).subscribe({
                    next: (resp: any) => {
                        newData.cdls.map((reg: any, index: any) => {
                            if (reg.id == resp.id) {
                                newData.cdls[index] = resp;
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
    public deactivateCdlById(id: number, driverIdMod: number) {
        return this.cdlService.apiCdlDeactivateIdPut(driverIdMod).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                this.cdlService.apiCdlListGet(driverId).subscribe({
                    next: (resp: any) => {
                        newData.cdls = resp;

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });

                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);
                    },
                });

                this.cdlService.apiCdlIdGet(id).subscribe({
                    next: (resp: any) => {
                        newData.cdls.map((reg: any, index: any) => {
                            if (reg.id == resp.id) {
                                newData.cdls[index] = resp;
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

    public renewCdlUpdate(data: RenewCdlCommand): Observable<any> {
        return this.cdlService.apiCdlRenewPost(data).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                this.cdlService.apiCdlListGet(driverId).subscribe({
                    next: (resp: any) => {
                        newData.cdls = resp;

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });

                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);
                    },
                });

                /*
               this.cdlService.apiCdlIdGet(res.id).subscribe({
                    next: (resp: any) => {

                        newData.cdls.map((reg: any, index: any) => {
                            if (reg.id == resp.id) {
                                newData.cdls[index] = resp;
                            }
                        });

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });

                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);

                       ;
                    },

                });

                });
                */
            })
        );
    }

    public getCdlById(id: number): Observable<CdlResponse> {
        return this.cdlService.apiCdlIdGet(id);
    }

    public getCdlDropdowns(): Observable<GetCdlModalResponse> {
        return this.cdlService.apiCdlModalGet();
    }
}
