import { RepairShopResponse } from './../../../../../../appcoretruckassist/model/repairShopResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';


export interface ShopState extends EntityState<RepairShopResponse[], number> {}
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shop' })
export class ShopStore extends EntityStore<ShopState> {
  constructor() {
    super();
  }
}