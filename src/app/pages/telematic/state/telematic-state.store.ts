import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { TelematicState } from '@pages/telematic/models/telematic-state.model';

export interface TelematicStateState extends EntityState<TelematicState> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'telematic-state' })
export class TelematicStateStore extends EntityStore<
    TelematicStateState,
    TelematicState
> {
    constructor() {
        super();
    }
}
