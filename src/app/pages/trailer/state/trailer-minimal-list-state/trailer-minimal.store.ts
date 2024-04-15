import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TrailerMinimalResponse } from 'appcoretruckassist';

export interface TrailerMinimalListState
    extends EntityState<TrailerMinimalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trailerMinimalList' })
export class TrailersMinimalListStore extends EntityStore<TrailerMinimalListState> {
    constructor() {
        super();
    }
}
