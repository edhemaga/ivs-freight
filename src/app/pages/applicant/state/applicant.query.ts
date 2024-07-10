import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

import {
    ApplicantStore,
    ApplicantState,
} from '@pages/applicant/state/applicant.store';

@Injectable({ providedIn: 'root' })
export class ApplicantQuery extends QueryEntity<ApplicantState> {
    public applicant$ = this.select('applicant');

    public applicantDropdownLists$ = this.select('applicantDropdownLists');

    public applicantSphForm$ = this.select('applicantSphForm');

    public selectedMode$ = this.select('selectedMode');

    constructor(protected applicantStore: ApplicantStore) {
        super(applicantStore);
    }
}
