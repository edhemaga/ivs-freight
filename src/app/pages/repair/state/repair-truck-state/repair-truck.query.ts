import { Injectable } from '@angular/core';

// store
import { QueryEntity } from '@datorama/akita';
import {
    RepairTruckState,
    RepairTruckStore,
} from '@pages/repair/state/repair-truck-state/repair-truck.store';

@Injectable({ providedIn: 'root' })
export class RepairTruckQuery extends QueryEntity<RepairTruckState> {
    constructor(protected repairTruckStore: RepairTruckStore) {
        super(repairTruckStore);
    }
}
