import { Injectable, OnDestroy } from '@angular/core';
import {
    CdlResponse,
    CdlService,
    GetCdlModalResponse,
} from 'appcoretruckassist';
import { Observable, Subject, tap } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversDetailsListStore } from './driver-details-list-state/driver-details-list.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { DriverTService } from './driver.service';
import { RenewCdlCommand } from '../../../../../../appcoretruckassist/model/renewCdlCommand';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';
import { DriversInactiveStore } from './driver-inactive-state/driver-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class CdlTService implements OnDestroy {
    private destroy$ = new Subject<void>();
    constructor(
        private cdlService: CdlService,
        private driverService: DriverTService,
        private driverActiveStore: DriversActiveStore,
        private driverInactiveStore: DriversInactiveStore,
        private tableService: TruckassistTableService,
        private driverItemStore: DriversItemStore,
        private notificationService: NotificationService,
        private dlStore: DriversDetailsListStore,
        private formDataService: FormDataService
    ) {}

    // Add Cdl
    public addCdl(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.cdlService.apiCdlPost().pipe(
            tap(() => {
                if (data?.driverId) {
                    let driverById = this.driverService
                        .getDriverById(data.driverId)
                        .subscribe({
                            next: (driver: any) => {
                                // Update Driver Data
                                driver = {
                                    ...driver,
                                    fullName:
                                        driver.firstName +
                                        ' ' +
                                        driver.lastName,
                                    cdlNumber: data?.cdlNumber
                                        ? data.cdlNumber
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

                                driverById.unsubscribe();
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

                let cdlApi = this.cdlService.apiCdlIdGet(res.id).subscribe({
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

                        cdlApi.unsubscribe();
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
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let allCdls = this.cdlService
                    .apiCdlListGet(driverId)
                    .subscribe({
                        next: (resp: any) => {
                            newData.cdls = resp;

                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: newData,
                                id: newData.id,
                            });

                            this.dlStore.add(newData);
                            this.driverItemStore.set([newData]);

                            allCdls.unsubscribe();
                        },
                    });

                /*
                let cdlApi = this.cdlService.apiCdlIdGet(res.id).subscribe({
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

                        cdlApi.unsubscribe();
                    },
                });
                */
            })
        );
    }
    public deactivateCdlById(id: number, driverIdMod: number) {
        return this.cdlService.apiCdlDeactivateIdPut(driverIdMod).pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let allCdls = this.cdlService
                    .apiCdlListGet(driverId)
                    .subscribe({
                        next: (resp: any) => {
                            newData.cdls = resp;

                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: newData,
                                id: newData.id,
                            });

                            this.dlStore.add(newData);
                            this.driverItemStore.set([newData]);

                            allCdls.unsubscribe();
                        },
                    });

                /*
                let cdlApi = this.cdlService.apiCdlIdGet(res.id).subscribe({
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

                        cdlApi.unsubscribe();
                    },
                });

                */
            })
        );
    }
    public renewCdlUpdate(data: RenewCdlCommand): Observable<any> {
        return this.cdlService.apiCdlRenewPost(data).pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let allCdls = this.cdlService
                    .apiCdlListGet(driverId)
                    .subscribe({
                        next: (resp: any) => {
                            newData.cdls = resp;

                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: newData,
                                id: newData.id,
                            });

                            this.dlStore.add(newData);
                            this.driverItemStore.set([newData]);

                            allCdls.unsubscribe();
                        },
                    });

                /*
                let cdlApi = this.cdlService.apiCdlIdGet(res.id).subscribe({
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

                        cdlApi.unsubscribe();
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
