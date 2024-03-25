import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, Subject, forkJoin, takeUntil, tap } from 'rxjs';
import { ShopState, ShopStore } from './shop.store';
import { RepairTService } from '../repair.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class ShopResolver implements Resolve<ShopState> {
    constructor(
        private repairService: RepairTService,
        private tableService: TruckassistTableService,
        private repairShopStore: ShopStore
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
