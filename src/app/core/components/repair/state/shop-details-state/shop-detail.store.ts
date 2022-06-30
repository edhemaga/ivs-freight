import { RepairShopResponse } from 'appcoretruckassist';

import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';


export interface ShopItemState extends EntityState<RepairShopResponse,number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shopItem' })
export class ShopItemStore extends EntityStore<ShopItemState> {
  constructor() {
    super();
  }
}
