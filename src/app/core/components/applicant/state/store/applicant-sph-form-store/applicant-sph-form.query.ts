import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import {
  ApplicantSphFormState,
  ApplicantSphFormStore,
} from './applicant-sph-form.store';

@Injectable({ providedIn: 'root' })
export class ApplicantSphFormQuery extends QueryEntity<ApplicantSphFormState> {
  public verifyData$ = this.select((state) => state?.entities[1]?.verifyData);

  public stepOneList$ = this.select((state) => state?.entities[1]?.step1);

  public stepTwoList$ = this.select((state) => state?.entities[1]?.step2);

  public stepThreeList$ = this.select((state) => state?.entities[1]?.step3);

  constructor(protected applicantSphFormStore: ApplicantSphFormStore) {
    super(applicantSphFormStore);
  }
}
