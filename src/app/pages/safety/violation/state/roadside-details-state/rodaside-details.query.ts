import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    RoadItemState,
    RoadItemStore,
} from '@pages/safety/violation/state/roadside-details-state/roadside-details.store';

@Injectable({ providedIn: 'root' })
export class RoadDetailsQuery extends QueryEntity<RoadItemState> {
    constructor(protected roadItemStore: RoadItemStore) {
        super(roadItemStore);
    }
}
