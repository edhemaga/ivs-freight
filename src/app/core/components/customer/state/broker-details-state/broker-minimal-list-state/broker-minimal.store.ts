import { BrokerResponse } from 'appcoretruckassist';

import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface BrokerMinimalListState
  extends EntityState<BrokerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driverMinimalList' })
export class BrokerMinimalListStore extends EntityStore<BrokerMinimalListState> {
  constructor() {
    super();
  }
}
