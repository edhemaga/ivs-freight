import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import {
    RepairShopResponse,
    RepairShopShortResponse,
} from 'appcoretruckassist';

export interface RepairMinimalListState
    extends EntityState<RepairShopResponse | RepairShopShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairMinimalList' })
export class RepairMinimalListStore extends EntityStore<RepairMinimalListState> {
    constructor() {
        super();
    }
}
