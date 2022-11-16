import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TrailerShortResponse } from 'appcoretruckassist';

export interface TrailerInactiveState
    extends EntityState<TrailerShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trailerInactive' })
export class TrailerInactiveStore extends EntityStore<TrailerInactiveState> {
    constructor() {
        super();
    }
}
