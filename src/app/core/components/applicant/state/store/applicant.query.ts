import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

import { ApplicantStore, ApplicantState } from './applicant.store';

@Injectable({ providedIn: 'root' })
export class ApplicantQuery extends QueryEntity<ApplicantState> {
  public applicant$ = this.select('applicant');

  public applicantDropdownLists$ = this.select('applicantDropdownLists');

  public applicantSphForm$ = this.select('applicantSphForm');

  constructor(protected applicantStore: ApplicantStore) {
    super(applicantStore);
  }
}
