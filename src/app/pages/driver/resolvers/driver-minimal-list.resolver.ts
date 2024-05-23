import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/pages/driver-modals/driver-modal/services/driver.service';

// store
import {
    DriverMinimalListState,
    DriversMinimalListStore,
} from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.store';

// models
import { DriverMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DriverMinimalResolver implements Resolve<DriverMinimalListState> {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private driverService: DriverService,
        private driverMinimalListStore: DriversMinimalListStore
    ) {}
    resolve(): Observable<DriverMinimalListResponse> | Observable<any> {
        return this.driverService
            .getDriversMinimalList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No drivers data for...');
                }),
                tap((driverMinimalList: DriverMinimalListResponse) => {
                    this.driverMinimalListStore.set(
                        driverMinimalList.pagination.data
                    );
                })
            );
    }
}
