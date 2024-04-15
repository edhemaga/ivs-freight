import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import {
    TrailerItemState,
    TrailerItemStore,
} from '@pages/trailer/state/trailer-details-state/trailer-details.store';

@Injectable({ providedIn: 'root' })
export class TrailerDetailsQuery extends QueryEntity<TrailerItemState> {
    constructor(protected trailerItemStore: TrailerItemStore) {
        super(trailerItemStore);
    }
}
