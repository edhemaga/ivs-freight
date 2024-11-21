import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { BrokerService } from '@pages/customer/services';

// store
import { BrokerStore } from '@pages/customer/state/broker-state/broker.store';

// models
import { GetBrokerListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class BrokerResolver {
    constructor(
        // services
        private brokerService: BrokerService,

        // store
        private brokerStore: BrokerStore
    ) {}

    resolve(): Observable<GetBrokerListResponse> {
        return this.brokerService
            .getBrokerList(
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
            )
            .pipe(
                tap((brokerPagination) => {
                    localStorage.setItem(
                        'brokerShipperTableCount',
                        JSON.stringify({
                            broker: brokerPagination.brokerCount,
                            shipper: brokerPagination.shipperCount,
                        })
                    );

                    this.brokerStore.set(brokerPagination.pagination.data);
                })
            );
    }
}
