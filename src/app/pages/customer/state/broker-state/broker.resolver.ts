import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { BrokerTService } from './broker.service';
import { BrokerState, BrokerStore } from './broker.store';

@Injectable({
    providedIn: 'root',
})
export class BrokerResolver implements Resolve<BrokerState> {
    constructor(
        private brokerService: BrokerTService,
        private brokerStore: BrokerStore,
        private tableService: TruckassistTableService
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
