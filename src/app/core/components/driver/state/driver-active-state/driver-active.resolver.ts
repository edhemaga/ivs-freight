import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DriverTService } from '../driver.service';
import { DriversActiveState, DriversActiveStore } from './driver-active.store';

@Injectable({
    providedIn: 'root',
})
export class DriverActiveResolver implements Resolve<DriversActiveState> {
    constructor(
        private driverService: DriverTService,
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

                    console.log('config', config);

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
