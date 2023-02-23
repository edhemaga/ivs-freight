import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ShopState, ShopStore } from './shop.store';
import { RepairTService } from '../repair.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class ShopResolver implements Resolve<ShopState> {
    constructor(
        private repairService: RepairTService,
        private shopStore: ShopStore,
        private tableService: TruckassistTableService
    ) {}

    resolve(): Observable<any> {
        return null;
        // forkJoin([
        //     this.repairService.getRepairShopList(
        //         1,
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         1,
        //         25
        //     ),
        //     this.tableService.getTableConfig(12),
        // ]).pipe(
        //     tap(([repairPagination, tableConfig]) => {
        //         localStorage.setItem(
        //             'repairShopTableCount',
        //             JSON.stringify({
        //                 repairShops: repairPagination.repairShopCount,
        //             })
        //         );

        //         if (tableConfig) {
        //             const config = JSON.parse(tableConfig.config);

        //             localStorage.setItem(
        //                 `table-${tableConfig.tableType}-Configuration`,
        //                 JSON.stringify(config)
        //             );
        //         }

        //         this.shopStore.set(repairPagination.pagination.data);
        //     })
        // );
    }
}
