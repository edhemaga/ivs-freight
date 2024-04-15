import { Injectable } from '@angular/core';

// Store
import { QueryEntity } from '@datorama/akita';
import {
    BrokerItemState,
    BrokerDetailsStore,
} from '@pages/customer/state/broker-details-state/broker-details.store';

@Injectable({ providedIn: 'root' })
export class BrokerDetailsQuery extends QueryEntity<BrokerItemState> {
    constructor(protected brokerItemStore: BrokerDetailsStore) {
        super(brokerItemStore);
    }
}
