import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { ExtendedFuelStopResponse } from '@pages/fuel/pages/fuel-stop-details/models';

export interface FuelDetailsState
    extends EntityState<ExtendedFuelStopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fuelDetails' })
export class FuelDetailsStore extends EntityStore<FuelDetailsState> {
    constructor() {
        super();
    }
}
