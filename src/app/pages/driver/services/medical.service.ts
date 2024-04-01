import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

//Models
import {
    MedicalResponse,
    MedicalService,
} from 'appcoretruckassist';


//Services
import { DriverTService } from './driver.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

//Store
import { DriversActiveStore } from '../state/driver-active-state/driver-active.store';
import { DriversItemStore } from '../state/driver-details-state/driver-details.store';
import { DriversDetailsListStore } from '../state/driver-details-list-state/driver-details-list.store';
import { DriversInactiveStore } from '../state/driver-inactive-state/driver-inactive.store';
import { DriversActiveQuery } from '../state/driver-active-state/driver-active.query';
import { DriversInactiveQuery } from '../state/driver-inactive-state/driver-inactive.query';

@Injectable({
    providedIn: 'root',
})
export class MedicalTService implements OnDestroy {
    private destroy$ = new Subject<void>();
    constructor(
        private medicalService: MedicalService,
        private driverService: DriverTService,
        private driverActiveStore: DriversActiveStore,
        private driverActiveQuery: DriversActiveQuery,
        private driverInactiveStore: DriversInactiveStore,
        private driverInactiveQuery: DriversInactiveQuery,
        private tableService: TruckassistTableService,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore,
        private formDataService: FormDataService
    ) {}

    // Add Medical
    public addMedical(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.medicalService.apiMedicalPost().pipe(
            tap(() => {
                if (data?.driverId) {
                    let driverById = this.driverService
                        .getDriverById(data.driverId)
                        .subscribe({
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
                                    fullName:
                                        driver.firstName +
                                        ' ' +
                                        driver.lastName,
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

                                driverById.unsubscribe();
                            },
                        });
                }
            })
        );
    }

    public deleteMedicalById(id: number): Observable<any> {
        return this.medicalService.apiMedicalIdDelete(id).pipe(
            tap((res: any) => {
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

                let medicalApi = this.medicalService
                    .apiMedicalIdGet(res.id)
                    .subscribe({
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

                            medicalApi.unsubscribe();
                        },
                    });
            })
        );
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
