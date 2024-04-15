import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    LoadClosedState,
    LoadClosedStore,
} from '@pages/load/state/load-closed-state/load-closed.store';

@Injectable({ providedIn: 'root' })
export class LoadClosedQuery extends QueryEntity<LoadClosedState> {
    constructor(protected loadClosedStore: LoadClosedStore) {
        super(loadClosedStore);
    }
}
