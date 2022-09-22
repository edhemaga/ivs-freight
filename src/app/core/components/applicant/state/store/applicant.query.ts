import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { ApplicantStore, ApplicantState } from './applicant.store';

@Injectable({ providedIn: 'root' })
export class ApplicantQuery extends QueryEntity<ApplicantState> {
  public personalInfoList$ = this.select(
    (state) => state.entities[1].personalInfo
  );

  constructor(protected applicantStore: ApplicantStore) {
    super(applicantStore);
  }
}
