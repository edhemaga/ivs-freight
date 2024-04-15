import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

// store
import {
    RoutingStateStore,
    RoutingStateState,
} from '@pages/routing/state/routing-state.store';

//model
import { RoutingState } from '@pages/routing/models/routing-state.model';

@Injectable({
    providedIn: 'root',
})
export class RoutingStateQuery extends QueryEntity<
    RoutingStateState,
    RoutingState
> {
    constructor(protected store: RoutingStateStore) {
        super(store);
    }
}
