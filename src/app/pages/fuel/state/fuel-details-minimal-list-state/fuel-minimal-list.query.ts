import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import {
    FuelMinimalListState,
    FuelMinimalListStore,
} from '@pages/fuel/state/fuel-details-minimal-list-state/fuel-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class FuelMinimalListQuery extends QueryEntity<FuelMinimalListState> {
    constructor(protected fuelMinimalListStore: FuelMinimalListStore) {
        super(fuelMinimalListStore);
    }
}
