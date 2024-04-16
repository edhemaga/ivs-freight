import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

//state
import {
    CompanyRepairShopState,
    CompanyRepairShopStore,
} from '@pages/settings/state/setting-reapir-shop-state/company-repairshop.store';

@Injectable({ providedIn: 'root' })
export class CompanyRepairShopQuery extends QueryEntity<CompanyRepairShopState> {
    constructor(protected companyRepairShopStore: CompanyRepairShopStore) {
        super(companyRepairShopStore);
    }
}
