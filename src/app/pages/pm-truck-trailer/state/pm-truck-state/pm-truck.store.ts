import { Injectable } from '@angular/core';

// Akita
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { PMTruckUnitResponse } from 'appcoretruckassist';

export interface PmTruckState
    extends EntityState<PMTruckUnitResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'pmTruck' })
export class PmTruckStore extends EntityStore<PmTruckState> {
    constructor() {
        super();
    }
}
