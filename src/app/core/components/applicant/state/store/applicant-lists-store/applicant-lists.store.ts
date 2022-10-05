import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { ApplicantModalResponse } from 'appcoretruckassist/model/models';

export interface ApplicantListsState
  extends EntityState<ApplicantModalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'applicant-lists' })
export class ApplicantListsStore extends EntityStore<ApplicantListsState> {
  constructor() {
    super();
  }
}
