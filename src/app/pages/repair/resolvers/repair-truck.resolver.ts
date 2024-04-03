import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { RepairService } from '../../../shared/services/repair.service';

// Store
import {
    RepairTruckState,
    RepairTruckStore,
} from '../state/repair-truck-state/repair-truck.store';

@Injectable({
    providedIn: 'root',
})
export class RepairTruckResolver implements Resolve<RepairTruckState> {
    constructor(
        private repairService: RepairService,
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
                        repairShops: repairTruckPagination.repairShopCount,
                        repairTrucks: repairTruckPagination.truckCount,
                        repairTrailers: repairTruckPagination.trailerCount,
                        truckMoneyTotal: repairTruckPagination?.truckMoneyTotal
                            ? repairTruckPagination.truckMoneyTotal
                            : 'NA',
                        trailerMoneyTotal:
                            repairTruckPagination?.trailerMoneyTotal
                                ? repairTruckPagination.trailerMoneyTotal
                                : 'NA',
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
