import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { PmListTruckState, PmListTruckStore } from './pm-list-truck.store';

@Injectable({ providedIn: 'root' })
export class PmListTruckQuery extends QueryEntity<PmListTruckState> {
    constructor(protected pmListTruckStore: PmListTruckStore) {
        super(pmListTruckStore);
    }
}
