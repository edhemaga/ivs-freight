import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    RepairTrailerState,
    RepairTrailerStore,
} from '@pages/repair/state/repair-trailer-state/repair-trailer.store';

@Injectable({ providedIn: 'root' })
export class RepairTrailerQuery extends QueryEntity<RepairTrailerState> {
    constructor(protected repairTrailerStore: RepairTrailerStore) {
        super(repairTrailerStore);
    }
}
