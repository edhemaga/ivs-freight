import { Injectable, OnDestroy } from '@angular/core';
import {
    CdlResponse,
    CdlService,
    CreateResponse,
    DriverResponse,
    GetCdlModalResponse,
} from 'appcoretruckassist';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversDetailsListStore } from './driver-details-list-state/driver-details-list.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { DriverTService } from './driver.service';
import { RenewCdlCommand } from '../../../../../../appcoretruckassist/model/renewCdlCommand';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

@Injectable({
    providedIn: 'root',
})
export class CdlTService implements OnDestroy {
    private destroy$ = new Subject<void>();
    constructor(
        private cdlService: CdlService,
        private driverService: DriverTService,
        private driverStore: DriversActiveStore,
        private tableService: TruckassistTableService,
        private driverItemStore: DriversItemStore,
        private notificationService: NotificationService,
        private dlStore: DriversDetailsListStore,
        private formDataService: FormDataService
    ) {}

    /* Observable<CreateCdlResponse> */
    public addCdl(data: /* CreateCdlCommand */ any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.cdlService.apiCdlPost().pipe(
            tap((res: CreateResponse) => {

                let driverId = data.driverId ? data.driverId : this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let cdlApi = this.cdlService.apiCdlIdGet(res.id).subscribe({
                    next: (resp: any) => {

                        newData.cdls.push(resp);
                        
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

    public updateCdl(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        let driverId = data.driverId ? data.driverId : this.driverItemStore.getValue().ids[0];
        return this.cdlService.apiCdlPut().pipe(
            tap((res: any) => {
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let cdlApi = this.cdlService.apiCdlIdGet(res.id).subscribe({
                    next: (resp: any) => {

                       
                        newData.cdls.map((reg: any, index: any) => {
                            if ( reg.id == res.id ) {
                                newData.cdls[index] = resp;  
                            }
                        })

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
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .subscribe({
                        next: (driver: any) => {
                            this.driverStore.remove(
                                ({ id }) => id === driverId
                            );
                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            /*this.dlStore.update(driver.id, {
                                cdls: driver.cdls,
                            });*/
                            this.tableService.sendActionAnimation({
                                animation: 'delete',
                                data: driver,
                                id: driverId,
                            });

                            subDriver.unsubscribe();
                        },
                    });
            })
        );
    }

    public activateCdlById(id: number): Observable<any> {
        return this.cdlService.apiCdlActivateIdPut(id).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .subscribe({
                        next: (driver: any) => {
                            this.driverStore.remove(
                                ({ id }) => id === driverId
                            );

                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            /*this.dlStore.update(driver.id, {
                                cdls: driver.cdls,
                            });*/
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: driver,
                                id: driverId,
                            });

                            subDriver.unsubscribe();
                        },
                    });
            })
        );
    }
    public deactivateCdlById(id: number) {
        return this.cdlService.apiCdlDeactivateIdPut(id).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .subscribe({
                        next: (driver: any) => {
                            this.driverStore.remove(
                                ({ id }) => id === driverId
                            );

                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            /*this.dlStore.update(driver.id, {
                                cdls: driver.cdls,
                            });*/
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: driver,
                                id: driverId,
                            });

                            subDriver.unsubscribe();
                        },
                    });
            })
        );
    }
    public renewCdlUpdate(data: RenewCdlCommand): Observable<any> {
        return this.cdlService.apiCdlRenewPut(data).pipe(
            tap(() => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .subscribe({
                        next: (driver: any) => {
                            this.driverStore.remove(
                                ({ id }) => id === driverId
                            );

                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            /*this.dlStore.update(driver.id, {
                                cdls: driver.cdls,
                            });*/
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: driver,
                                id: driverId,
                            });

                            subDriver.unsubscribe();
                        },
                    });
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
