import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { BrokerService } from '@pages/customer/services/broker.service';

// Store
import {
    BrokerState,
    BrokerStore,
} from '@pages/customer/state/broker-state/broker.store';

@Injectable({
    providedIn: 'root',
})
export class BrokerResolver implements Resolve<BrokerState> {
    constructor(
        // Services
        private brokerService: BrokerService,
        private tableService: TruckassistTableService,

        // Store
        private brokerStore: BrokerStore
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.brokerService.getBrokerList(
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
                undefined,
                1,
                25
            ),
            this.tableService.getTableConfig(4),
        ]).pipe(
            tap(([brokerPagination, tableConfig]) => {
                localStorage.setItem(
                    'brokerShipperTableCount',
                    JSON.stringify({
                        broker: brokerPagination.brokerCount,
                        shipper: brokerPagination.shipperCount,
                    })
                );

                if (tableConfig) {
                    const config = JSON.parse(tableConfig.config);

                    localStorage.setItem(
                        `table-${tableConfig.tableType}-Configuration`,
                        JSON.stringify(config)
                    );
                }

                this.brokerStore.set(brokerPagination.pagination.data);
            })
        );
    }
}
