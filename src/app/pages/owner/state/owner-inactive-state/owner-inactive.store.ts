import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { OwnerTableResponse } from 'appcoretruckassist';

export interface OwnerInactiveState
    extends EntityState<OwnerTableResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ownerInactive' })
export class OwnerInactiveStore extends EntityStore<OwnerInactiveState> {
    constructor() {
        super();
    }
}
