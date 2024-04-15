import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    RoadsideDetailsListState,
    RoadsideDetailsListStore,
} from '@pages/safety/violation/state/roadside-details-state/roadside-details-list-state/roadside-details-list.store';

@Injectable({ providedIn: 'root' })
export class RoadsideDetailsListQuery extends QueryEntity<RoadsideDetailsListState> {
    constructor(protected roadsideDetailsListStore: RoadsideDetailsListStore) {
        super(roadsideDetailsListStore);
    }
}
