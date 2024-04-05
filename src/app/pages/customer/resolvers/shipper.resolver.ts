import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin, tap } from 'rxjs';

// Store
import {
    ShipperState,
    ShipperStore,
} from '../state/shipper-state/shipper.store';

// Service
import { ShipperService } from '../services/shipper.service';
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';

@Injectable({
    providedIn: 'root',
})
export class ShipperResolver implements Resolve<ShipperState> {
    constructor(
        // Store
        private shipperStore: ShipperStore,

        // Service
        private shipperService: ShipperService,
        private tableService: TruckassistTableService
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
