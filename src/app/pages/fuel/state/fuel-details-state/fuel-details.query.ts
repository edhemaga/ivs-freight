import { Injectable } from '@angular/core';

// store
import { QueryEntity } from '@datorama/akita';
import {
    FuelDetailsState,
    FuelDetailsStore,
} from '@pages/fuel/state/fuel-details-state/fuel-details.store';

@Injectable({ providedIn: 'root' })
export class FuelDetailsQuery extends QueryEntity<FuelDetailsState> {
    constructor(protected fuelDetailsStore: FuelDetailsStore) {
        super(fuelDetailsStore);
    }
}
