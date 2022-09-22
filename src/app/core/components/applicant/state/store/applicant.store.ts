import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { ApplicantResponse } from 'appcoretruckassist/model/models';

export interface ApplicantState
  extends EntityState<ApplicantResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'applicant' })
export class ApplicantStore extends EntityStore<ApplicantState> {
  constructor() {
    super();
  }
}
