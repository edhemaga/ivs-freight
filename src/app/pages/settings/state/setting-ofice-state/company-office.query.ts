import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

// state
import {
    OfficeState,
    OfficeStore,
} from '@pages/settings/state/setting-ofice-state/company-office.store';

@Injectable({ providedIn: 'root' })
export class OfficeQuery extends QueryEntity<OfficeState> {
    constructor(protected officeStore: OfficeStore) {
        super(officeStore);
    }
}
