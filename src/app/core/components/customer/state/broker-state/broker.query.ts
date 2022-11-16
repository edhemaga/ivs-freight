import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BrokerState, BrokerStore } from './broker.store';

@Injectable({ providedIn: 'root' })
export class BrokerQuery extends QueryEntity<BrokerState> {
   constructor(protected brokerStore: BrokerStore) {
      super(brokerStore);
   }
}
