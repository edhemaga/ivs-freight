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

  public educationList$ = this.select((state) => state.entities[1].education);

  public sevenDaysHosList$ = this.select(
    (state) => state.entities[1].sevenDaysHos
  );

  public drugAndAlcoholList$ = this.select(
    (state) => state.entities[1].drugAndAlcohol
  );

  public driverRightsList$ = this.select(
    (state) => state.entities[1].driverRight
  );

  public disclosureAndReleaseList$ = this.select(
    (state) => state.entities[1].disclosureRelease
  );

  public authorizationList$ = this.select(
    (state) => state.entities[1].authorization
  );

  public requestsList$ = this.select((state) => state.entities[1].requests);

  constructor(protected applicantStore: ApplicantStore) {
    super(applicantStore);
  }
}
