import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { PmListTrailerState, PmListTrailerStore } from './pm-list-trailer.store';

@Injectable({ providedIn: 'root' })
export class PmListTrailerQuery extends QueryEntity<PmListTrailerState> {
    constructor(protected pmListTrailerStore: PmListTrailerStore) {
        super(pmListTrailerStore);
    }
}
