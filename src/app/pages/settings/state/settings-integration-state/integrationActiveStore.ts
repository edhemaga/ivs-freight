import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// core
import { IntegrationListResponse } from 'appcoretruckassist';

export interface IntegrationActiveState
    extends EntityState<IntegrationListResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'integration' })
export class IntegrationStore extends EntityStore<IntegrationActiveState> {
    constructor() {
        super();
    }
}
