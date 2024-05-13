import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    TrailerInactiveState,
    TrailerInactiveStore,
} from '@pages/trailer/state/trailer-inactive-state/trailer-inactive.store';

@Injectable({ providedIn: 'root' })
export class TrailerInactiveQuery extends QueryEntity<TrailerInactiveState> {
    constructor(protected trailerStore: TrailerInactiveStore) {
        super(trailerStore);
    }
}
