import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { IApplicantStore } from '../model/applicant-store.model';

export interface ApplicantState extends EntityState<IApplicantStore> {}

export const initialState = (): ApplicantState => {
   return {
      applicant: null,
      applicantDropdownLists: null,
      applicantSphForm: null,
   };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'applicant' })
export class ApplicantStore extends EntityStore<ApplicantState> {
   constructor() {
      super(initialState());
   }
}
