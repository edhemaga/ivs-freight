import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RepairShopResponse } from '../../../../../../../../appcoretruckassist/model/repairShopResponse';

export interface ShopDetailsListState
  extends EntityState<RepairShopResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shopDetailsList' })
export class ShopDetailsListStore extends EntityStore<ShopDetailsListState> {
  constructor() {
    super();
  }
}
