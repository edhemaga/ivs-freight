import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    BrokerMinimalListState,
    BrokerMinimalListStore,
} from './broker-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class BrokerMinimalListQuery extends QueryEntity<BrokerMinimalListState> {
    constructor(protected brokerMinimalListStore: BrokerMinimalListStore) {
        super(brokerMinimalListStore);
    }
}
