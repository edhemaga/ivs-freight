import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

//state
import {
    CompanyState,
    CompanyStore,
} from '@pages/settings/state/company-state/company-settings.store';

@Injectable({ providedIn: 'root' })
export class CompanyQuery extends QueryEntity<CompanyState> {
    constructor(protected companyStore: CompanyStore) {
        super(companyStore);
    }
}
