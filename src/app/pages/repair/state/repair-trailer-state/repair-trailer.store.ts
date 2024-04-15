import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
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
