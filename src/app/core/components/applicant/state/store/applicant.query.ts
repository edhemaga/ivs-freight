import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { ApplicantStore, ApplicantState } from './applicant.store';

@Injectable({ providedIn: 'root' })
export class ApplicantQuery extends QueryEntity<ApplicantState> {
  public personalInfoList$ = this.select(
    (state) => state.entities[1].personalInfo
  );

  public workExperienceList$ = this.select(
    (state) => state.entities[1].workExperience
  );

  public cdlInformationList$ = this.select(
    (state) => state.entities[1].cdlInformation
  );

  public accidentRecordList$ = this.select(
    (state) => state.entities[1].accidentRecords
  );

  public trafficViolationsList$ = this.select(
    (state) => state.entities[1].trafficViolation
  );

  constructor(protected applicantStore: ApplicantStore) {
    super(applicantStore);
  }
}
