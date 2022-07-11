import { BrokerResponse } from 'appcoretruckassist';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface BrokerItemState extends EntityState<BrokerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'brokerItem' })
export class BrokerItemStore extends EntityStore<BrokerItemState> {
  constructor() {
    super();
  }
}
