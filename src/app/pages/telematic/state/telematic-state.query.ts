import { Injectable } from '@angular/core';

// store
import { QueryEntity } from '@datorama/akita';

// Store
import {
    TelematicStateStore,
    TelematicStateState,
} from '@pages/telematic/state/telematic-state.store';

// Models
import { TelematicState } from '@pages/telematic/models/telematic-state.model';

@Injectable({
    providedIn: 'root',
})
export class TelematicStateQuery extends QueryEntity<
    TelematicStateState,
    TelematicState
> {
    constructor(protected store: TelematicStateStore) {
        super(store);
    }
}
