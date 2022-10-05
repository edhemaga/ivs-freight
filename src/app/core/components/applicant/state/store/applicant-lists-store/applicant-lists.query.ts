import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import {
  ApplicantListsState,
  ApplicantListsStore,
} from './applicant-lists.store';

@Injectable({ providedIn: 'root' })
export class ApplicantListsQuery extends QueryEntity<ApplicantListsState> {
  public dropdownLists$ = this.select((state) => state.entities[1]);

  constructor(protected applicantListsStore: ApplicantListsStore) {
    super(applicantListsStore);
  }
}
