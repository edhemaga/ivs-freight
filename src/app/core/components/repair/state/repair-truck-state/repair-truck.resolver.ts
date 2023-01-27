import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { RepairTService } from '../repair.service';
import { RepairTruckState, RepairTruckStore } from './repair-truck.store';

@Injectable({
    providedIn: 'root',
})
export class RepairTruckResolver implements Resolve<RepairTruckState> {
    constructor(
        private repairService: RepairTService,
        private repairTruckStore: RepairTruckStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.repairService.getRepairList(
                undefined,
                1,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                1,
                25
            ),
            this.tableService.getTableConfig(10),
        ]).pipe(
            tap(([repairTruckPagination, tableConfig]) => {
                localStorage.setItem(
                    'repairTruckTrailerTableCount',
                    JSON.stringify({
                        repairTrucks: repairTruckPagination.truckCount,
                        repairTrailers: repairTruckPagination.trailerCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.repairTruckStore.set(
                    repairTruckPagination.pagination.data
                );
            })
        );
    }
}
