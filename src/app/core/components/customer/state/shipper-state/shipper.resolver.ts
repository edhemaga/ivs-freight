import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin, tap } from 'rxjs';
import { ShipperState, ShipperStore } from './shipper.store';
import { ShipperTService } from './shipper.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class ShipperResolver implements Resolve<ShipperState> {
    constructor(
        private shipperService: ShipperTService,
        private tableService: TruckassistTableService,
        private shipperStore: ShipperStore
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.shipperService.getShippersList(
                null,
                null,
                null,
                null,
                1,
                25,
                null
            ),
            this.tableService.getTableConfig(5),
        ]).pipe(
            tap(([shipperPagination, tableConfig]) => {
                localStorage.setItem(
                    'brokerShipperTableCount',
                    JSON.stringify({
                        broker: shipperPagination.brokerCount,
                        shipper: shipperPagination.shipperCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.shipperStore.set(shipperPagination.pagination.data);
            })
        );
    }
}
