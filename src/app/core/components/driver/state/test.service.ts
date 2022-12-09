import { Injectable, OnDestroy } from '@angular/core';
import {
    DriverResponse,
    GetTestModalResponse,
    TestResponse,
    TestService,
} from 'appcoretruckassist';
import { Observable, Subject, tap } from 'rxjs';
import { DriverTService } from './driver.service';
import { DriversActiveStore } from './driver-active-state/driver-active.store';
import { DriversItemStore } from './driver-details-state/driver-details.store';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { DriversDetailsListStore } from './driver-details-list-state/driver-details-list.store';
import { FormDataService } from 'src/app/core/services/formData/form-data.service';

@Injectable({
    providedIn: 'root',
})
export class TestTService implements OnDestroy {
    private destroy$ = new Subject<void>();
    constructor(
        private drugService: TestService,
        private driverService: DriverTService,
        private driverStore: DriversActiveStore,
        private tableService: TruckassistTableService,
        private driverItemStore: DriversItemStore,
        private dlStore: DriversDetailsListStore,
        private formDataService: FormDataService
    ) {}

    /* Observable<CreateTestResponse> */
    public addTest(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.drugService.apiTestPost().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];

                const dr = this.driverItemStore.getValue();
                const driverData = JSON.parse(JSON.stringify(dr.entities));
                let newData = driverData[driverId];

                let testApi = this.drugService.apiTestIdGet(res.id).subscribe({
                    next: (resp: any) => {
                        newData.tests.push(resp);

                        this.tableService.sendActionAnimation({
                            animation: 'update',
                            data: newData,
                            id: newData.id,
                        });

                        this.dlStore.add(newData);
                        this.driverItemStore.set([newData]);

                        testApi.unsubscribe();
                    },
                });
            })
        );
    }

    public updateTest(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.drugService.apiTestPut().pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .subscribe({
                        next: (driver: DriverResponse | any) => {
                            // this.driverStore.remove(
                            //     ({ id }) => id === driverId
                            // );
                            // driver = {
                            //     ...driver,
                            //     fullName:
                            //         driver.firstName + ' ' + driver.lastName,
                            // };
                            // this.driverStore.add(driver);
                            // this.dlStore.update(driver.id, {
                            //     tests: driver.tests,
                            // });
                            // this.tableService.sendActionAnimation({
                            //     animation: 'update',
                            //     data: driver,
                            //     id: driverId,
                            // });
                            // subDriver.unsubscribe();
                        },
                    });
            })
        );
    }

    public deleteTestById(id: number): Observable<any> {
        return this.drugService.apiTestIdDelete(id).pipe(
            tap((res: any) => {
                let driverId = this.driverItemStore.getValue().ids[0];
                const subDriver = this.driverService
                    .getDriverById(driverId)
                    .subscribe({
                        next: (driver: DriverResponse | any) => {
                            // this.driverStore.remove(
                            //     ({ id }) => id === driverId
                            // );
                            // driver = {
                            //     ...driver,
                            //     fullName:
                            //         driver.firstName + ' ' + driver.lastName,
                            // };
                            // this.driverStore.add(driver);
                            // this.dlStore.update(driver.id, {
                            //     tests: driver.tests,
                            // });
                            // this.tableService.sendActionAnimation({
                            //     animation: 'delete',
                            //     data: driver,
                            //     id: driverId,
                            // });
                            // subDriver.unsubscribe();
                        },
                    });
            })
        );
    }

    public getTestById(id: number): Observable<TestResponse> {
        return this.drugService.apiTestIdGet(id);
    }

    public getTestDropdowns(): Observable<GetTestModalResponse> {
        return this.drugService.apiTestModalGet();
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
