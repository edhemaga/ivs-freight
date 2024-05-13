import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    BrokerState,
    BrokerStore,
} from '@pages/customer/state/broker-state/broker.store';

@Injectable({ providedIn: 'root' })
export class BrokerQuery extends QueryEntity<BrokerState> {
    constructor(protected brokerStore: BrokerStore) {
        super(brokerStore);
    }
}
