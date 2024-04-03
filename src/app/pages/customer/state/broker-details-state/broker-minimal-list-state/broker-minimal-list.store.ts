import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { BrokerResponse } from 'appcoretruckassist/model/brokerResponse';

export interface BrokerMinimalListState
    extends EntityState<BrokerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'brokerMinimalList' })
export class BrokerMinimalListStore extends EntityStore<BrokerMinimalListState> {
    constructor() {
        super();
    }
}
