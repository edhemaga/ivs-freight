import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import {
    RepairMinimalListState,
    RepairMinimalListStore,
} from '@pages/repair/state/driver-details-minimal-list-state/repair-minimal-list.store';

@Injectable({ providedIn: 'root' })
export class RepairMinimalListQuery extends QueryEntity<RepairMinimalListState> {
    constructor(protected repairMinimalListStore: RepairMinimalListStore) {
        super(repairMinimalListStore);
    }
}
