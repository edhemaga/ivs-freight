import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    BrokerDetailsListState,
    BrokerDetailsListStore,
} from './broker-details-list.store';

@Injectable({ providedIn: 'root' })
export class BrokerDetailsListQuery extends QueryEntity<BrokerDetailsListState> {
    constructor(protected brokerDetailsListStore: BrokerDetailsListStore) {
        super(brokerDetailsListStore);
    }
}
