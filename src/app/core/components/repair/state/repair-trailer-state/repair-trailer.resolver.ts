import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { RepairTService } from '../repair.service';
import { RepairTrailerState, RepairTrailerStore } from './repair-trailer.store';

@Injectable({
    providedIn: 'root',
})
export class RepairTrailerResolver implements Resolve<RepairTrailerState> {
    constructor(
        private repairService: RepairTService,
        private repairTrailerStore: RepairTrailerStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.repairService.getRepairList(
                undefined,
                2,
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
            this.tableService.getTableConfig(11),
        ]).pipe(
            tap(([repairTrailerPagination, tableConfig]) => {
                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.repairTrailerStore.set(
                    repairTrailerPagination.pagination.data
                );
            })
        );
    }
}
