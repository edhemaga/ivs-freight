import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RoutingStateStore, RoutingStateState } from './routing-state.store';
import { RoutingState } from './routing-state.model';

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
