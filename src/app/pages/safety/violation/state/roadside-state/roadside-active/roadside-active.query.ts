import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    RoadsideActiveState,
    RoadsideActiveStore,
} from '@pages/safety/violation/state/roadside-state/roadside-active/roadside-active.store';

@Injectable({ providedIn: 'root' })
export class RoadsideActiveQuery extends QueryEntity<RoadsideActiveState> {
    constructor(protected roadsideActiveStore: RoadsideActiveStore) {
        super(roadsideActiveStore);
    }
}
