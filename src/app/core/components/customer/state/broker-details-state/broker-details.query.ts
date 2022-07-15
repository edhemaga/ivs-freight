import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BrokerItemState, BrokerDetailsStore } from './broker-details.store';

@Injectable({ providedIn: 'root' })
export class BrokerDetailsQuery extends QueryEntity<BrokerItemState> {
  constructor(protected brokerItemStore: BrokerDetailsStore) {
    super(brokerItemStore);
  }
}
