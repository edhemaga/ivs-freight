import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TrailerResponse } from 'appcoretruckassist';

export interface TrailerDetailsListState
    extends EntityState<TrailerResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trailerDetailsList' })
export class TrailerDetailsListStore extends EntityStore<TrailerDetailsListState> {
    constructor() {
        super();
    }
}
