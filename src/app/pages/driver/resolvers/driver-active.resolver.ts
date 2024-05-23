import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DriverService } from '@pages/driver/pages/driver-modals/driver-modal/services/driver.service';

// store
import {
    DriversActiveState,
    DriversActiveStore,
} from '@pages/driver/state/driver-active-state/driver-active.store';

@Injectable({
    providedIn: 'root',
})
export class DriverActiveResolver implements Resolve<DriversActiveState> {
    constructor(
        private driverService: DriverService,
        private store: DriversActiveStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.driverService.getDrivers(
                1,
                undefined,
                undefined,
                undefined,
                1,
                25
            ),
            this.tableService.getTableConfig(6),
        ]).pipe(
            tap(([driverPagination, tableConfig]) => {
                localStorage.setItem(
                    'driverTableCount',
                    JSON.stringify({
                        active: driverPagination.activeCount,
                        inactive: driverPagination.inactiveCount,
                        applicant: driverPagination.applicantCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.store.set(driverPagination.pagination.data);
            })
        );
    }
}
