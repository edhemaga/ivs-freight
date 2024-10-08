import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { OwnerTableResponse } from 'appcoretruckassist';

export interface OwnerActiveState
    extends EntityState<OwnerTableResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ownerActive' })
export class OwnerActiveStore extends EntityStore<OwnerActiveState> {
    constructor() {
        super();
    }
}
