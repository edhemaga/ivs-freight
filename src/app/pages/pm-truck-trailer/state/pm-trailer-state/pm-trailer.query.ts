import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PmTrailerState, PmTrailerStore } from './pm-trailer.store';

@Injectable({ providedIn: 'root' })
export class PmTrailerQuery extends QueryEntity<PmTrailerState> {
    constructor(protected pmTrailerStore: PmTrailerStore) {
        super(pmTrailerStore);
    }
}
