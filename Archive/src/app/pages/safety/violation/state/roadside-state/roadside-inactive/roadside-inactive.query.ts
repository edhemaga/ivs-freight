import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    RoadsideInactiveState,
    RoadsideInactiveStore,
} from '@pages/safety/violation/state/roadside-state/roadside-inactive/roadside-inactive.store';

@Injectable({ providedIn: 'root' })
export class RoadsideInactiveQuery extends QueryEntity<RoadsideInactiveState> {
    constructor(protected roadsideInactiveStore: RoadsideInactiveStore) {
        super(roadsideInactiveStore);
    }
}
