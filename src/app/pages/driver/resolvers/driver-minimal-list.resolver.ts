import { Injectable } from '@angular/core';

import { Observable, of, catchError, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';

// store
import { DriversMinimalListStore } from '@pages/driver/state/driver-details-minimal-list-state/driver-minimal-list.store';

// models
import { DriverMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DriverMinimalResolver {
    private pageIndex: number = 1;
    private pageSize: number = 25;

    constructor(
        private driverService: DriverService,
        private driverMinimalListStore: DriversMinimalListStore
    ) {}
    resolve(): Observable<string | DriverMinimalListResponse> {
        return this.driverService
            .getDriversMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                tap((driverMinimalList) => {
                    this.driverMinimalListStore.set(
                        driverMinimalList.pagination.data
                    );
                }),
                catchError(() => {
                    return of('No drivers data for...');
                })
            );
    }
}
