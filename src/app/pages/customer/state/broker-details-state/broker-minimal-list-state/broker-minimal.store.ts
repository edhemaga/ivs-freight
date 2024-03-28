import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
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
