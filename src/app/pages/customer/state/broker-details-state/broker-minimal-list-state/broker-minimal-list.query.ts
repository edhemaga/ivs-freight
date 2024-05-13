import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    BrokerMinimalListState,
    BrokerMinimalListStore,
} from '@pages/customer/state/broker-details-state/broker-minimal-list-state/broker-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class BrokerMinimalListQuery extends QueryEntity<BrokerMinimalListState> {
    constructor(protected brokerMinimalListStore: BrokerMinimalListStore) {
        super(brokerMinimalListStore);
    }
}
