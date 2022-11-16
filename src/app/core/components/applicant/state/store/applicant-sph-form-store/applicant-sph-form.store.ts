import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { SphPreviousEmployerProspectResponse } from 'appcoretruckassist/model/models';

export interface ApplicantSphFormState
    extends EntityState<
        {
            companyInfo: any;
            verifyData: any;
            step1: SphPreviousEmployerProspectResponse;
            step2: any;
            step3: any;
        },
        number
    > {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'applicant-sph-form' })
export class ApplicantSphFormStore extends EntityStore<ApplicantSphFormState> {
    constructor() {
        super();
    }
}
