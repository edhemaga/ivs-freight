import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { BrokerResponse } from 'appcoretruckassist';

export interface BrokerState extends EntityState<BrokerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'broker' })
export class BrokerStore extends EntityStore<BrokerState> {
    constructor() {
        super();
    }
}
