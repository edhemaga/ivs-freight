import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { ExtendedRepairShopResponse } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/models';

export interface RepairDetailsState
    extends EntityState<ExtendedRepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairDetails' })
export class RepairDetailsStore extends EntityStore<RepairDetailsState> {
    constructor() {
        super();
    }
}
