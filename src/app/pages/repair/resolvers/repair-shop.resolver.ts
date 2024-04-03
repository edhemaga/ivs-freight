import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin, tap } from 'rxjs';

// Store
import { RepairShopState, RepairShopStore } from '../state/repair-shop-state/repair-shop.store';

// Services
import { RepairService } from '../../../shared/services/repair.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class RepairShopResolver implements Resolve<RepairShopState> {
    constructor(
        private repairService: RepairService,
        private tableService: TruckassistTableService,
        private repairShopStore: RepairShopStore
    ) {}

    resolve(): Observable<any> {
        return forkJoin([
            this.repairService.getRepairShopList(
                undefined,
                undefined,
                undefined,
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

                this.repairShopStore.set(
                    repairTrailerPagination.pagination.data
                );
            })
        );
    }
}
