import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    TrailerMinimalListState,
    TrailersMinimalListStore,
} from './trailer-minimal.store';

@Injectable({ providedIn: 'root' })
export class TrailersMinimalListQuery extends QueryEntity<TrailerMinimalListState> {
    constructor(protected trailerMinimalListStore: TrailersMinimalListStore) {
        super(trailerMinimalListStore);
    }
}
