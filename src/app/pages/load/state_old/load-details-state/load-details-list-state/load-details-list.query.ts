import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    LoadDetailsListState,
    LoadDetailsListStore,
} from '@pages/load/state_old/load-details-state/load-details-list-state/load-details-list.store';

@Injectable({ providedIn: 'root' })
export class LoadDetailsListQuery extends QueryEntity<LoadDetailsListState> {
    constructor(protected loadDetailsListStore: LoadDetailsListStore) {
        super(loadDetailsListStore);
    }
}
