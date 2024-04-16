import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    PmTruckState,
    PmTruckStore,
} from '@pages/pm-truck-trailer/state/pm-truck-state/pm-truck.store';

@Injectable({ providedIn: 'root' })
export class PmTruckQuery extends QueryEntity<PmTruckState> {
    constructor(protected pmTruckStore: PmTruckStore) {
        super(pmTruckStore);
    }
}
