import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RoutingState } from './routing-state.model';

export interface RoutingStateState extends EntityState<RoutingState> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'routing-state' })
export class RoutingStateStore extends EntityStore<
    RoutingStateState,
    RoutingState
> {
    constructor() {
        super();
    }
}
