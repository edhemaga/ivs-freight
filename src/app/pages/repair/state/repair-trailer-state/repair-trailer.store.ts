import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { RepairResponse } from 'appcoretruckassist';

export interface RepairTrailerState
    extends EntityState<RepairResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairTrailer' })
export class RepairTrailerStore extends EntityStore<RepairTrailerState> {
    constructor() {
        super();
    }
}
