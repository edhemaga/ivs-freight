import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { RepairTrailerState, RepairTrailerStore } from './repair-trailer.store';

@Injectable({ providedIn: 'root' })
export class RepairTrailerQuery extends QueryEntity<RepairTrailerState> {
    constructor(protected repairTrailerStore: RepairTrailerStore) {
        super(repairTrailerStore);
    }
}
