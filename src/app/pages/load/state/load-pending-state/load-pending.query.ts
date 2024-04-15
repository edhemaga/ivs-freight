import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    LoadPandingState,
    LoadPendingStore,
} from '@pages/load/state/load-pending-state/load-pending.store';

@Injectable({ providedIn: 'root' })
export class LoadPendingQuery extends QueryEntity<LoadPandingState> {
    constructor(protected loadPandinStore: LoadPendingStore) {
        super(loadPandinStore);
    }
}
