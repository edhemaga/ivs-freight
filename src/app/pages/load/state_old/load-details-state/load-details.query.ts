import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    LoadItemState,
    LoadItemStore,
} from '@pages/load/state/load-details-state/load-details.store';

@Injectable({ providedIn: 'root' })
export class LoadDetailsQuery extends QueryEntity<LoadItemState> {
    constructor(protected loadItemStore: LoadItemStore) {
        super(loadItemStore);
    }
}
