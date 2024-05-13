import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// core
import { RepairShopResponse } from 'appcoretruckassist';
import { RepairShopNewListResponse } from 'appcoretruckassist';

export interface CompanyRepairShopState
    extends EntityState<RepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'companyRepairShopStore' })
export class CompanyRepairShopStore extends EntityStore<RepairShopNewListResponse> {
    constructor() {
        super();
    }
}
