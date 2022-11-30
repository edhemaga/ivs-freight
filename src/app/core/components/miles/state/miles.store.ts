import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ApplicantShortResponse } from 'appcoretruckassist';

export interface MilesTableState
    extends EntityState<ApplicantShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'milesTable' })
export class MilesTableStore extends EntityStore<MilesTableState> {
    constructor() {
        super();
    }
}
