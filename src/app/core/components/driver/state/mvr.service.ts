import { MvrService } from './../../../../../../appcoretruckassist/api/mvr.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, tap, takeUntil, Subject } from 'rxjs';
import { DriverResponse, GetMvrModalResponse, MvrResponse } from 'appcoretruckassist';
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DriversDetailsListStore } from './driver-details-list-state/driver-details-list.store';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

@Injectable({
    providedIn: 'root',
})
export class MvrTService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private mvrService: MvrService,
        private driverService: DriverTService,
        private driverStore: DriversActiveStore,
        private tableService: TruckassistTableService,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore,
        private formDataService: FormDataService
    ) {}

    public deleteMvrById(id: number): Observable<any> {
        return this.mvrService.apiMvrIdDelete(id).pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .pipe(takeUntil(this.destroy$))
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
                                mvrs: driver.mvrs,
                            }); */
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

    public getMvrById(id: number): Observable<MvrResponse> {
        return this.mvrService.apiMvrIdGet(id);
    }

    /* Observable<CreateMvrResponse> */
    public addMvr(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.mvrService.apiMvrPost().pipe(
                tap((res: any) => {
                    let driverId = this.driverItemStore.getValue().ids[0];
                    const dr = this.driverItemStore.getValue();
                    const driverData = JSON.parse(JSON.stringify(dr.entities));
                    let newData = driverData[driverId];
    
                    let mvrApi = this.mvrService.apiMvrIdGet(res.id).subscribe({
                        next: (resp: any) => {
    
                            newData.mvrs.push(resp);
                           
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: newData,
                                id: newData.id,
                            });
                            
                            this.dlStore.add(newData);
                            this.driverItemStore.set([newData]);
                          
                            mvrApi.unsubscribe();
                        },
                    });  
            })
        );
    }

    public updateMvr(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.mvrService.apiMvrPut().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let mvrApi = this.mvrService.apiMvrIdGet(res.id).subscribe({
                    next: (resp: any) => {

                       
                        newData.mvrs.map((reg: any, index: any) => {
                            if ( reg.id == resp.id ) {
                                newData.mvrs[index] = resp;  
                            }
                        })

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });
                        
                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);
                      
                        mvrApi.unsubscribe();
                    },
                });  
            })
        );
    }

    public getMvrModal(driverId: number): Observable<GetMvrModalResponse> {
        return this.mvrService.apiMvrModalDriverIdGet(driverId);
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
