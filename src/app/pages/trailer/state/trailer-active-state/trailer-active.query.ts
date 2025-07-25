import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    TrailerActiveState,
    TrailerActiveStore,
} from '@pages/trailer/state/trailer-active-state/trailer-active.store';

@Injectable({ providedIn: 'root' })
export class TrailerActiveQuery extends QueryEntity<TrailerActiveState> {
    constructor(protected trailerStore: TrailerActiveStore) {
        super(trailerStore);
    }
}
