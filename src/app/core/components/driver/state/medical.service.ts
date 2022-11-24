import { Injectable, OnDestroy } from '@angular/core';
import {
    DriverResponse,
    MedicalResponse,
    MedicalService,
} from 'appcoretruckassist';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DriversDetailsListStore } from './driver-details-list-state/driver-details-list.store';
import { getFunctionParams } from 'src/app/core/utils/methods.globals';

@Injectable({
    providedIn: 'root',
})
export class MedicalTService implements OnDestroy {
    private destroy$ = new Subject<void>();
    constructor(
        private medicalService: MedicalService,
        private driverService: DriverTService,
        private driverStore: DriversActiveStore,
        private tableService: TruckassistTableService,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore
    ) {}

    public deleteMedicalById(id: number): Observable<any> {
        return this.medicalService.apiMedicalIdDelete(id).pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (driver: DriverResponse | any) => {
                            this.driverStore.remove(
                                ({ id }) => id === driverId
                            );
                            this.driverItemStore.remove(
                                ({ id }) => id === driverId
                            );
                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            this.driverItemStore.add(driver);
                            this.dlStore.update(driver.id, {
                                medicals: driver.medicals,
                            });
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

    public getMedicalById(id: number): Observable<MedicalResponse> {
        return this.medicalService.apiMedicalIdGet(id);
    }

    /* Observable<CreateMedicalResponse> */
    public addMedical(data: any): Observable<any> {
        const sortedParams = getFunctionParams(
            this.medicalService.apiMedicalPost,
            data
        );

        return this.medicalService.apiMedicalPost(...sortedParams).pipe(
            tap((res: any) => {
                const subDriver = this.driverService
                    .getDriverById(data.driverId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (driver: DriverResponse | any) => {
                            this.driverStore.remove(
                                ({ id }) => id === data.driverId
                            );

                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            this.dlStore.update(driver.id, {
                                medicals: driver.medicals,
                            });
                            this.tableService.sendActionAnimation({
                                animation: 'update',
                                data: driver,
                                id: driver.id,
                            });

                            subDriver.unsubscribe();
                        },
                    });
            })
        );
    }

    public updateMedical(data: any): Observable<object> {
        const sortedParams = getFunctionParams(
            this.medicalService.apiMedicalPut,
            data
        );
        return this.medicalService.apiMedicalPut(...sortedParams).pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (driver: DriverResponse | any) => {
                            this.driverStore.remove(
                                ({ id }) => id === driverId
                            );

                            driver = {
                                ...driver,
                                fullName:
                                    driver.firstName + ' ' + driver.lastName,
                            };

                            this.driverStore.add(driver);
                            this.dlStore.update(driver.id, {
                                medicals: driver.medicals,
                            });
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
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
