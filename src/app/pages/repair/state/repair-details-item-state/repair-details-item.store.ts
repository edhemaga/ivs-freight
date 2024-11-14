import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';

export interface RepairItemState
    extends EntityState<ExtendedRepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairItem' })
export class RepairItemStore extends EntityStore<RepairItemState> {
    constructor() {
        super();
    }
}
