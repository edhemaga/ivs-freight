import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    LoadMinimalListState,
    LoadMinimalListStore,
} from '@pages/load/state_old/load-details-state/load-minimal-list-state/load-details-minimal.store';

@Injectable({ providedIn: 'root' })
export class LoadMinimalListQuery extends QueryEntity<LoadMinimalListState> {
    constructor(protected loadMinimalListStore: LoadMinimalListStore) {
        super(loadMinimalListStore);
    }
}
