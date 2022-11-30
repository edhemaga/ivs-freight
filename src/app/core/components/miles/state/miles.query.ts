import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MilesTableState, MilesTableStore } from './miles.store';

@Injectable({ providedIn: 'root' })
export class ApplicantTableQuery extends QueryEntity<MilesTableState> {
    constructor(protected applicantStore: MilesTableStore) {
        super(applicantStore);
    }
}
