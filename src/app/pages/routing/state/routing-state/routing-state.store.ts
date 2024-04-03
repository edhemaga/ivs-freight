import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// model
import { RoutingState } from '../../models/routing-state.model';

export interface RoutingStateState extends EntityState<RoutingState> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'routing-state', idKey: 'fakeId' })
export class RoutingStateStore extends EntityStore<
    RoutingStateState,
    RoutingState
> {
    constructor() {
        super();
    }
}
