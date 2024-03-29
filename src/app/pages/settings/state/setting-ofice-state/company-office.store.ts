import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CompanyOfficeResponse } from 'appcoretruckassist';

export interface OfficeState
    extends EntityState<CompanyOfficeResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'companyOfficeStore' })
export class OfficeStore extends EntityStore<OfficeState> {
    constructor() {
        super();
    }
}
