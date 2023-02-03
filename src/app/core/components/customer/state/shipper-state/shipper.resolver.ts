import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ShipperTService } from './shipper.service';
import { ShipperState, ShipperStore } from './shipper.store';

@Injectable({
    providedIn: 'root',
})
export class ShipperResolver implements Resolve<ShipperState> {
    constructor(
        private shipperService: ShipperTService,
        private shipperStore: ShipperStore,
        private tableService: TruckassistTableService
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.shipperService.getShippersList(null, null, 1, 25),
            this.tableService.getTableConfig(5),
        ])
            .pipe(
                tap(([shipperPagination, tableConfig]) => {
                    if (tableConfig) {
                        const config = JSON.parse(tableConfig.config);

                        localStorage.setItem(
                            `table-${tableConfig.tableType}-Configuration`,
                            JSON.stringify(config)
                        );
                    }
                    this.shipperStore.set(shipperPagination.pagination.data);
                })
            )
    }
}
