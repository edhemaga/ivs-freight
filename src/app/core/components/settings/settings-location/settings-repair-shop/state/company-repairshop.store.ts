import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RepairShopResponse } from '../../../../../../../../appcoretruckassist/model/repairShopResponse';

export interface CompanyRepairShopState
    extends EntityState<RepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'companyRepairShopStore' })
export class CompanyRepairShopStore extends EntityStore<CompanyRepairShopState> {
    constructor() {
        super();
    }
}
