import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { BrokerItemState, BrokerDetailsStore } from './broker-details.store';

@Injectable({ providedIn: 'root' })
export class BrokerDetailsQuery extends QueryEntity<BrokerItemState> {
    constructor(protected brokerItemStore: BrokerDetailsStore) {
        super(brokerItemStore);
    }
}
