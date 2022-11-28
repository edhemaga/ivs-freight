import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ApplicantShortResponse } from 'appcoretruckassist';

export interface ApplicantTableState
    extends EntityState<ApplicantShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'applicantAdminTable' })
export class ApplicantTableStore extends EntityStore<ApplicantTableState> {
    constructor() {
        super();
    }
}
