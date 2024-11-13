import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { RepairShopResponse } from 'appcoretruckassist';

export interface RepairMinimalListState
    extends EntityState<RepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairMinimalList' })
export class RepairMinimalListStore extends EntityStore<RepairMinimalListState> {
    constructor() {
        super();
    }
}
