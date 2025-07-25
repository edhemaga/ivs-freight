import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { BrokerResponse } from 'appcoretruckassist';

export interface BrokerDetailsListState
    extends EntityState<BrokerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'brokerDetailsList' })
export class BrokerDetailsListStore extends EntityStore<BrokerDetailsListState> {
    constructor() {
        super();
    }
}
