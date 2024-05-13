import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    TrailerDetailsListState,
    TrailerDetailsListStore,
} from '@pages/trailer/state/trailer-details-list-state/trailer-details-list.store';

@Injectable({ providedIn: 'root' })
export class TrailersDetailsListQuery extends QueryEntity<TrailerDetailsListState> {
    constructor(protected trailerDetailsListStore: TrailerDetailsListStore) {
        super(trailerDetailsListStore);
    }
}
