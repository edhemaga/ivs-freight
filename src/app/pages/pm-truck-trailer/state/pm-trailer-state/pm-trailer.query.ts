import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import {
    PmTrailerState,
    PmTrailerStore,
} from '@pages/pm-truck-trailer/state/pm-trailer-state/pm-trailer.store';

@Injectable({ providedIn: 'root' })
export class PmTrailerQuery extends QueryEntity<PmTrailerState> {
    constructor(protected pmTrailerStore: PmTrailerStore) {
        super(pmTrailerStore);
    }
}
