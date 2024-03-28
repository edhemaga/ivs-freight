import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    ApplicantTableState,
    ApplicantTableStore,
} from './applicant-table.store';

@Injectable({ providedIn: 'root' })
export class ApplicantTableQuery extends QueryEntity<ApplicantTableState> {
    constructor(protected applicantStore: ApplicantTableStore) {
        super(applicantStore);
    }
}
