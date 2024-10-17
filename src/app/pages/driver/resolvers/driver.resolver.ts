import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { DriverService } from '@pages/driver/services/driver.service';

// store
import { DriverStore } from '@pages/driver/state/driver-state/driver.store';

// models
import { DriverListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DriverResolver {
    private activeId: number = 1;
    private pageIndex: number = 1;
    private pageSize: number = 25;

    constructor(
        private driverService: DriverService,

        // store
        private store: DriverStore
    ) {}

    resolve(): Observable<DriverListResponse> {
        return this.driverService
            .getDrivers(
                this.activeId,
                undefined,
                undefined,
                undefined,
                this.pageIndex,
                this.pageSize
            )
            .pipe(
                tap((driverPagination) => {
                    localStorage.setItem(
                        'driverTableCount',
                        JSON.stringify({
                            active: driverPagination.activeCount,
                            inactive: driverPagination.inactiveCount,
                            applicant: driverPagination.applicantCount,
                        })
                    );

                    this.store.set(driverPagination.pagination.data);
                })
            );
    }
}
