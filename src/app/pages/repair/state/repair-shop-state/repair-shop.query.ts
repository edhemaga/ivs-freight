import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { RepairShopStore } from './repair-shop.store';

// Models
import { RepairShopResponse } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class RepairShopQuery extends QueryEntity<RepairShopResponse> {
    constructor(protected repairShopStore: RepairShopStore) {
        super(repairShopStore);
    }
}
