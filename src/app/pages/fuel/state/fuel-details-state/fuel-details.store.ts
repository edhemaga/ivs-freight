import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { FuelStopResponse } from 'appcoretruckassist';

export interface FuelDetailsState
    extends EntityState<FuelStopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fuelDetails' })
export class FuelDetailsStore extends EntityStore<FuelDetailsState> {
    constructor() {
        super();
    }
}
