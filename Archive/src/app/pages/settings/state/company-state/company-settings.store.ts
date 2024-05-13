import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

//state
import { CompanyResponse } from 'appcoretruckassist';

export interface CompanyState extends EntityState<CompanyResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'company' })
export class CompanyStore extends EntityStore<CompanyState> {
    constructor() {
        super();
    }
}
