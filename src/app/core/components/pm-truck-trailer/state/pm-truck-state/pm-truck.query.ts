import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PmTruckState, PmTruckStore } from './pm-truck.store';

@Injectable({ providedIn: 'root' })
export class PmTruckQuery extends QueryEntity<PmTruckState> {
    constructor(protected pmTruckStore: PmTruckStore) {
        super(pmTruckStore);
    }
}
