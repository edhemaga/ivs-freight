import { Injectable } from '@angular/core';


import { forkJoin, Observable, tap } from 'rxjs';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { DriverService } from '@pages/driver/services/driver.service';

// store
import {
    DriverState,
    DriverStore,
} from '@pages/driver/state/driver-state/driver.store';

@Injectable({
    providedIn: 'root',
})
export class DriverResolver  {
    private activeId: number = 1;
    private pageIndex: number = 1;
    private pageSize: number = 25;

    constructor(
        private driverService: DriverService,
        private tableService: TruckassistTableService,

        // store
        private store: DriverStore
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.driverService.getDrivers(
                this.activeId,
                undefined,
                undefined,
                undefined,
                this.pageIndex,
                this.pageSize
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
