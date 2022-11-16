import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TrailerShortResponse } from 'appcoretruckassist';

export interface TrailerActiveState
    extends EntityState<TrailerShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trailerActive' })
export class TrailerActiveStore extends EntityStore<TrailerActiveState> {
    constructor() {
        super();
    }
}
