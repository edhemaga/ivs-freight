import { Injectable } from '@angular/core';

// store
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

// models
import { RepairDetails } from '@pages/repair/models/repair-details.model';

export interface RepairDetailsState
    extends EntityState<RepairDetails, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairDetails' })
export class RepairDetailsStore extends EntityStore<RepairDetailsState> {
    constructor() {
        super();
    }
}
