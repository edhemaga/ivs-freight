import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    RoadsideMinimalListState,
    RoadsideMinimalListStore,
} from '@pages/safety/violation/state/roadside-details-state/roadside-minimal-list-state/roadside-minimal.store';

@Injectable({ providedIn: 'root' })
export class RoadsideMinimalListQuery extends QueryEntity<RoadsideMinimalListState> {
    constructor(protected rsMinimalListStore: RoadsideMinimalListStore) {
        super(rsMinimalListStore);
    }
}
