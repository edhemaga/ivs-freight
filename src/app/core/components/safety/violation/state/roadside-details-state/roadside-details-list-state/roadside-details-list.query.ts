import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    RoadsideDetailsListState,
    RoadsideDetailsListStore,
} from './roadside-details-list.store';

@Injectable({ providedIn: 'root' })
export class RoadsideDetailsListQuery extends QueryEntity<RoadsideDetailsListState> {
    constructor(protected roadsideDetailsListStore: RoadsideDetailsListStore) {
        super(roadsideDetailsListStore);
    }
}
