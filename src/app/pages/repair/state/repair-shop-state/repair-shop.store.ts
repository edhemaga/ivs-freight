import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// Models
import { RepairShopResponse } from 'appcoretruckassist';

export interface RepairShopState
    extends EntityState<RepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairShop' })
export class RepairShopStore extends EntityStore<RepairShopResponse> {
    constructor() {
        super();
    }
}
