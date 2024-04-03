import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { RepairTruckState, RepairTruckStore } from './repair-truck.store';

@Injectable({ providedIn: 'root' })
export class RepairTruckQuery extends QueryEntity<RepairTruckState> {
    constructor(protected repairTruckStore: RepairTruckStore) {
        super(repairTruckStore);
    }
}
