import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import {
    RepairItemState,
    RepairItemStore,
} from '@pages/repair/state/repair-details-item-state/repair-details-item.store';

@Injectable({ providedIn: 'root' })
export class RepairItemQuery extends QueryEntity<RepairItemState> {
    constructor(protected repairItemStore: RepairItemStore) {
        super(repairItemStore);
    }
}
