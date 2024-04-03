import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { BrokerResponse } from 'appcoretruckassist';

export interface BrokerItemState extends EntityState<BrokerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'brokerItem' })
export class BrokerDetailsStore extends EntityStore<BrokerItemState> {
    constructor() {
        super();
    }
}
