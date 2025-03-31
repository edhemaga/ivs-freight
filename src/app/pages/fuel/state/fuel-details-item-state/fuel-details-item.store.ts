import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { ExtendedFuelStopResponse } from '@pages/fuel/pages/fuel-stop-details/models';

export interface FuelItemState
    extends EntityState<ExtendedFuelStopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fuelItem' })
export class FuelItemStore extends EntityStore<FuelItemState> {
    constructor() {
        super();
    }
}
