import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MilesTableState, MilesTableStore } from './miles.store';

@Injectable({ providedIn: 'root' })
export class MilesTableQuery extends QueryEntity<MilesTableState> {
    constructor(protected milesStore: MilesTableStore) {
        super(milesStore);
    }
}
