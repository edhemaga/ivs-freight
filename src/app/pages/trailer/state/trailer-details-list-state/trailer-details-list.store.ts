import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface TrailerDetailsListState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trailerDetailsList' })
export class TrailerDetailsListStore extends EntityStore<TrailerDetailsListState> {
    constructor() {
        super();
    }
}
