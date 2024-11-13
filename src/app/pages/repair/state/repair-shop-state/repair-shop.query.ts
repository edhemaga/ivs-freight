import { Injectable } from '@angular/core';

// store
import { QueryEntity } from '@datorama/akita';
import { RepairShopStore } from '@pages/repair/state/repair-shop-state/repair-shop.store';

// models
import { RepairShopResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class RepairShopQuery extends QueryEntity<RepairShopResponse> {
    constructor(protected repairShopStore: RepairShopStore) {
        super(repairShopStore);
    }
}
