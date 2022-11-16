import {
    BrokerMinimalListState,
    BrokerMinimalListStore,
} from './broker-minimal.store';

import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class BrokerMinimalListQuery extends QueryEntity<BrokerMinimalListState> {
    constructor(protected brokerMinimalListStore: BrokerMinimalListStore) {
        super(brokerMinimalListStore);
    }
}
