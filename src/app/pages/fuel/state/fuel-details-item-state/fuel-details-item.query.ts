import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import {
    FuelItemState,
    FuelItemStore,
} from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';

@Injectable({ providedIn: 'root' })
export class FuelItemQuery extends QueryEntity<FuelItemState> {
    constructor(protected fuelItemStore: FuelItemStore) {
        super(fuelItemStore);
    }
}
