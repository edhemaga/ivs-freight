import { Injectable } from '@angular/core';

// store
import { QueryEntity } from '@datorama/akita';
import {
    RepairDetailsState,
    RepairDetailsStore,
} from '@pages/repair/state/repair-details-state/repair-details.store';

@Injectable({ providedIn: 'root' })
export class RepairDetailsQuery extends QueryEntity<RepairDetailsState> {
    constructor(protected repairDetailsStore: RepairDetailsStore) {
        super(repairDetailsStore);
    }
}
