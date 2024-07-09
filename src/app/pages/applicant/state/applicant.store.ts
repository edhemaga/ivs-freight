import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { IApplicantStore } from '@pages/applicant/models/applicant-store.model';
import { SelectedMode } from '../enums/selected-mode.enum';

export interface ApplicantState extends EntityState<IApplicantStore> {}

export const initialState = (): ApplicantState => {
    return {
        applicant: null,
        applicantDropdownLists: null,
        applicantSphForm: null,
        selectedMode: SelectedMode.APPLICANT,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'applicant' })
export class ApplicantStore extends EntityStore<ApplicantState> {
    constructor() {
        super(initialState());
    }
}
