import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RepairShopResponse } from 'appcoretruckassist';

export interface ShopState extends EntityState<RepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairShop' })
export class ShopStore extends EntityStore<RepairShopResponse> {
    constructor() {
        super();
    }
}
