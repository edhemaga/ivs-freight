import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BrokerItemState, BrokerItemStore } from './broker-details.store';

@Injectable({ providedIn: 'root' })
export class BrokerDetailsQuery extends QueryEntity<BrokerItemState> {
  constructor(protected brokerItemStore: BrokerItemStore) {
    super(brokerItemStore);
  }
}
