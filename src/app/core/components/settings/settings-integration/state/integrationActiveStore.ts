import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IntegrationListResponse } from 'appcoretruckassist';

export interface IntegrationActiveState
    extends EntityState<IntegrationListResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'integrationActive' })
export class IntegrationActiveStore extends EntityStore<IntegrationActiveState> {
    constructor() {
        super();
    }
}
